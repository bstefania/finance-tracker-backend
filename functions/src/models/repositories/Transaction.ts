import { DocumentReference } from 'firebase-admin/firestore';
import { db } from "../../firebase"
import { ApiError } from "../../middlewares/ErrorHandler";
import { HttpResponse } from '../../types/General'
import { Category, Transaction, TransactionInput, TransactionSource, TransactionType, User } from '../../types/Database'
import { checkAccess, idsToRef, querySnapshotToRef, refsToData } from '../../utils/FirestoreData';

const collectionName = 'transactions'
const usersCollectionName = 'users'
const categoriesCollectionName = "categories"
const categoryGroupsCollectionName = "categoryGroups"

const constructQuery = async (collection: string, queryParams: any, userRef: any) => {
  let query = db.collection(collection).where('owner', '==', userRef);

  if (queryParams.type) {
    query = query.where('type', '==', queryParams.type);
  }

  if (queryParams.createdAtStart) {
    const startDate = new Date(queryParams.createdAtStart);
    query = query.where('createdAt', '>=', startDate);
  }

  if (queryParams.createdAtEnd) {
    const endDate = new Date(queryParams.createdAtEnd);
    query = query.where('createdAt', '<=', endDate);
  }

  
  let groupDocs!: DocumentReference[];
  let categoryDocs: DocumentReference[];

  if (queryParams.categoryGroup) {
    const groupsSnapshot = await db.collection(categoryGroupsCollectionName)
      .where('owner', '==', userRef)
      .where('name', '==', queryParams.categoryGroup).get();

    groupDocs = querySnapshotToRef(groupsSnapshot)

    if (!groupDocs.length) {
      return
    }
  }

  if (queryParams.category) {
    let categorySnapshot: any = db.collection(categoriesCollectionName).where('owner', '==', userRef)
    if (queryParams.categoryGroup) {
      categorySnapshot = categorySnapshot.where('categoryGroup', 'in', groupDocs)
    }
    categorySnapshot = await categorySnapshot.where('name', '==', queryParams.category).get();
    categoryDocs = querySnapshotToRef(categorySnapshot)
    if (!categoryDocs.length) {
      return
    }
    query = query.where('category', 'in', categoryDocs)
  } else {
    if (queryParams.categoryGroup) {
      const categorySnapshot = await db.collection(categoriesCollectionName)
        .where('owner', '==', userRef)
        .where('categoryGroup', 'in', groupDocs).get()
      categoryDocs = querySnapshotToRef(categorySnapshot)
      if (!categoryDocs.length) {
        return
      }
      query = query.where('category', 'in', categoryDocs)
    }
  }

  query = query.orderBy('createdAt', 'desc');

  return query
}

export const getTransactions = async (userId: string, queryParams: Record<string, string>) => {
  const userRef = await idsToRef(userId, usersCollectionName);

  let query = await constructQuery(collectionName, queryParams, userRef)
  if(!query) {
    return []
  }

  const querySnapshot = await query.get();

  return Promise.all(querySnapshot.docs.map(async (ref) => {
    const data = ref.data();
    return {
      id: ref.id,
      type: data.type,
      amount: data.amount,
      createdAt: data.createdAt.toDate(),
      note: data.note,
      category: await refsToData(data.category,categoriesCollectionName) as unknown as Category,
      owner: await refsToData(userRef, usersCollectionName) as unknown as User,
      sharedWith: await refsToData(data.sharedWith, usersCollectionName) as unknown as User[],
    };
  }))
}

export const getTransaction = async (
  transactionId: string,
  userId: string
) => {
  // use one function
  const transactionRef = await idsToRef(transactionId, collectionName) as DocumentReference<FirebaseFirestore.DocumentData>
  const transaction = await refsToData(transactionRef, collectionName) as unknown as Transaction
  checkAccess(transaction, userId, collectionName)
  return transaction
}

// TODO: rollback / atomic transaction
export const createTransaction = async (transaction: TransactionInput, userId: string) => {
  const userRef = await idsToRef(userId, usersCollectionName) as DocumentReference
  const user = await refsToData(userRef, usersCollectionName) as unknown as User;
  const categoryRef = await idsToRef(transaction.categoryId, categoriesCollectionName) as DocumentReference

  // make sure the user has access to the category
  checkAccess((await categoryRef.get()).data(), userId, categoriesCollectionName)

  const transactionRef = await db.collection(collectionName).add({
    type: transaction.type,
    amount: transaction.amount,
    createdAt: new Date(transaction.createdAt),
    note: transaction.note,
    category: categoryRef,
    owner: userRef,
    sharedWith: await idsToRef(transaction.sharedWith, usersCollectionName),
  })

  if (!transactionRef) {
    throw new ApiError(HttpResponse.INTERNAL_SERVER_ERROR, "Transaction could not be created.")
  }

  await updateWealth(user, userRef, transaction.type, transaction.source, transaction.amount)
  return refsToData(transactionRef, collectionName);
}

const updateWealth = async (
  user: User,
  userRef: DocumentReference<FirebaseFirestore.DocumentData>,
  transactionType: TransactionType,
  transactionSource: TransactionSource,
  amount: number) => {

  switch (transactionType) {
    case TransactionType.Expense:
      user.wealth[transactionSource] -= amount;
      break;
    case TransactionType.Income:
      user.wealth[transactionSource] += amount;
      break;
    case TransactionType.Savings:
    case TransactionType.Investments:
      user.wealth[transactionType] += amount
      user.wealth[transactionSource] -= amount
      break;
    default:
      break;
  }
  await userRef.update({ wealth: user.wealth });
}

export const updateTransaction = async (
  transactionId: string,
  transactionUpdates: Partial<TransactionInput>,
  userId: string
) => {
  const transactionRef = await idsToRef(transactionId, collectionName) as DocumentReference
  const transaction = await refsToData(transactionRef, collectionName) as unknown as Transaction;

  checkAccess(transaction, userId, collectionName)

  const newData: any = {};
  for (let [key, value] of Object.entries(transactionUpdates)) {
    if (value !== undefined && !key.endsWith("Id")) {
      newData[key] = value;
    }
  }

  if (transactionUpdates.createdAt) {
    newData.createdAt = new Date(newData.createdAt)
  }

  if (transactionUpdates.categoryId) {
    newData.category = await idsToRef(transactionUpdates.categoryId, categoriesCollectionName)
    checkAccess(newData.category, userId, categoriesCollectionName)
  }

  if (transactionUpdates.sharedWith) {
    newData.sharedWith = await idsToRef(transactionUpdates.sharedWith, usersCollectionName)
  }

  await transactionRef.update(newData);
  const updatedTransaction = await refsToData(transactionRef, collectionName);

  if (!updatedTransaction) {
    throw new ApiError(HttpResponse.INTERNAL_SERVER_ERROR, "Transaction could not be updated.")
  }

  return updatedTransaction
}

export const deleteTransaction = async (transactionId: string, userId: string) => {
  const transactionRef = await idsToRef(transactionId, collectionName) as DocumentReference
  const transaction = await refsToData(transactionRef, collectionName) as unknown as Transaction
  checkAccess(transaction, userId, collectionName)
  await transactionRef.delete()
  return {
    id: transactionRef.id
  }
}

type AmountsFilters = {
  createdAtStart: string,
  createdAtEnd: string,
  type: string,
  category: string,
  categoryGroup: string,
}

export const getAmounts = async (queryParams: AmountsFilters, userId: string) => {
  const userRef = await idsToRef(userId, usersCollectionName);

  let query = await constructQuery(collectionName, queryParams, userRef)
  if (!query) {
    return {}
  }
  const querySnapshot = await query.get();

  const result: Record<string, any> = {}

  await Promise.all(querySnapshot.docs.map(async doc => {
    const data = doc.data();
    const category: any = await refsToData(data.category, categoriesCollectionName);
    const categoryGroup = category.categoryGroup

    if (!result[categoryGroup.name]) {
      result[categoryGroup.name] = {};
    }
    if (!result[categoryGroup.name][category.name]) {
      result[categoryGroup.name][category.name] = {
        color: category.color,
        amount: 0
      };
    }
    result[categoryGroup.name][category.name].amount += data.amount;
  }));

  return result;
}