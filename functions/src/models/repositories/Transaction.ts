import { DocumentReference } from 'firebase-admin/firestore';
import { db } from "../../firebase"
import { ApiError } from "../../middlewares/ErrorHandler";
import { HttpResponse } from '../../types/General'
import { Category, Transaction, TransactionInput, User } from '../../types/Database'
import { checkAccess, idsToRef, refsToData } from '../../utils/FirestoreData';

const collectionName = 'transactions'
const usersCollectionName = 'users'
const categoriesCollectionName = "categories"

export const getTransactions = async (userId: string) => {
  const userRef = await idsToRef(userId, usersCollectionName)
  const querySnapshot = await db
    .collection(collectionName)
    .where('owner', '==', userRef)
    .orderBy('createdAt', 'desc')
    .get();

  const owner = await refsToData(userRef) as User

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
      sharedWith: await refsToData(data.sharedWith) as User[],
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

export const createTransaction = async (transaction: TransactionInput, userId: string) => {
  console.log(transaction)
  const userRef = await idsToRef(userId, usersCollectionName) as DocumentReference
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

  return refsToData(transactionRef);
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