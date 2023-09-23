import { DocumentReference } from 'firebase-admin/firestore';
import { db } from "../../firebase"
import { ApiError } from "../../middlewares/ErrorHandler";
import { HttpResponse } from '../../types/General'
import { Category, Transaction, TransactionInput, TransactionSource, TransactionType, User } from '../../types/Database'
import { checkAccess, idsToRef, refsToData } from '../../utils/FirestoreData';

const collectionName = 'transactions'
const usersCollectionName = 'users'
const categoriesCollectionName = "categories"

export const getTransactions = async (userId: string, queryParams: Record<string, string>) => {
  const userRef = await idsToRef(userId, usersCollectionName);

  let query = db.collection(collectionName).where('owner', '==', userRef);

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

  if (queryParams.category) {
    const categoryRef = await idsToRef(queryParams.category, categoriesCollectionName);
    query = query.where('category', '==', categoryRef);
  }

  query = query.orderBy('createdAt', 'desc');

  const querySnapshot = await query.get();
  const owner = await refsToData(userRef) as unknown as User;

  return Promise.all(querySnapshot.docs.map(async (ref) => {
    const data = ref.data();
    return {
      id: ref.id,
      type: data.type,
      amount: data.amount,
      createdAt: data.createdAt.toDate(),
      note: data.note,
      category: await refsToData(data.category) as unknown as Category,
      owner,
      sharedWith: await refsToData(data.sharedWith) as unknown as User[],
    };
  }))
}

export const getTransaction = async (
  transactionId: string,
  userId: string
) => {
  const transactionRef = await idsToRef(transactionId, collectionName) as DocumentReference<FirebaseFirestore.DocumentData>
  const transaction = await refsToData(transactionRef) as unknown as Transaction
  checkAccess(transaction, userId)
  return transaction
}

// TODO: rollback
export const createTransaction = async (transaction: TransactionInput, userId: string) => {
  const userRef = await idsToRef(userId, usersCollectionName) as DocumentReference
  const user = await refsToData(userRef) as unknown as User;
  const categoryRef = await idsToRef(transaction.categoryId, categoriesCollectionName) as DocumentReference

  // make sure the user has access to the category
  checkAccess((await categoryRef.get()).data(), userId)

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
  return refsToData(transactionRef);
}

const updateWealth = async (
  user: User,
  userRef: DocumentReference<FirebaseFirestore.DocumentData>,
  transactionType: TransactionType,
  transactionSource: TransactionSource,
  amount: number) => {

    switch(transactionType) {
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
  const transaction = await refsToData(transactionRef) as unknown as Transaction;

  checkAccess(transaction, userId)

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
    checkAccess(newData.category, userId)
  }

  if (transactionUpdates.sharedWith) {
    newData.sharedWith = await idsToRef(transactionUpdates.sharedWith, usersCollectionName)
  }

  await transactionRef.update(newData);
  const updatedTransaction = await refsToData(transactionRef);

  if (!updatedTransaction) {
    throw new ApiError(HttpResponse.INTERNAL_SERVER_ERROR, "Transaction could not be updated.")
  }

  return updatedTransaction
}

export const deleteTransaction = async (transactionId: string, userId: string) => {
  const transactionRef = await idsToRef(transactionId, collectionName) as DocumentReference
  const transaction = await refsToData(transactionRef) as unknown as Transaction
  checkAccess(transaction, userId)
  await transactionRef.delete();
  return {
    id: transactionRef.id
  }
}