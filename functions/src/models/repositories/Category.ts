import { DocumentReference } from 'firebase-admin/firestore';
import { db } from "../../firebase"
import { ApiError } from "../../middlewares/ErrorHandler";
import { DocumentDetails, HttpResponse } from '../../types/General'
import {Category, CategoryGroup, CategoryInput, User } from '../../types/Database'
import { checkAccess, checkIfDataAlreadyExists, idsToRef, refsToData } from '../../utils/FirestoreData';

const collectionName = 'categories'
const usersCollectionName = 'users'
const categoryGroupCollectionName = "categoryGroups"

export const getCategories = async (userId: string) => {
  const userRef = await idsToRef(userId, usersCollectionName)
  const querySnapshot = await db
    .collection(collectionName)
    .where('owner', '==', userRef)
    .get();

  const owner = await refsToData(userRef) as User

  return Promise.all(querySnapshot.docs.map(async (ref) => {
    const data = ref.data();
    return {
      id: ref.id,
      name: data.name,
      owner,
      categoryGroup: await refsToData(data.categoryGroup) as unknown as CategoryGroup,
      sharedWith: await refsToData(data.sharedWith) as User[],
    };
  }))
}

export const getCategory = async (
  categoryId: string,
  userId: string
) => {
  const categoryRef = await idsToRef(categoryId, collectionName) as DocumentReference<FirebaseFirestore.DocumentData>
  const category = await refsToData(categoryRef) as unknown as Category
  checkAccess(category, userId)
  return category
}

export const createCategory = async (category: CategoryInput, userId: string) => {
  const collection = db.collection(collectionName)
  const userRef = await idsToRef(userId, usersCollectionName) as DocumentReference
  const categoryGroupRef = await idsToRef(category.categoryGroupId, categoryGroupCollectionName) as DocumentReference
  
  // make sure the user has access to the category group
  checkAccess((await categoryGroupRef.get()).data(), userId)

  const details: DocumentDetails = {
    name: category.name,
    categoryGroup: categoryGroupRef
  }
  await checkIfDataAlreadyExists(details, userRef, collection)

  const categoryRef = await db.collection(collectionName).add({
    name: category.name,
    owner: userRef,
    categoryGroup: categoryGroupRef,
    sharedWith: await idsToRef(category.sharedWith, usersCollectionName),
  })
  if (!categoryRef) {
    throw new ApiError(HttpResponse.INTERNAL_SERVER_ERROR, "Category could not be created.")
  }

  return refsToData(categoryRef);
}

export const updateCategory = async (
  categoryId: string,
  categoryUpdates: Partial<CategoryInput>,
  userId: string
) => {
  const categoryRef = await idsToRef(categoryId, collectionName) as DocumentReference
  const category = await refsToData(categoryRef) as unknown as Category;

  checkAccess(category, userId)

  const newData: any = {};
  for (let [key, value] of Object.entries(categoryUpdates)) {
    if (value !== undefined && !key.endsWith("Id")) {
      newData[key] = value;
    }
  }
  if (categoryUpdates.categoryGroupId) {
    newData.categoryGroup = await idsToRef(categoryUpdates.categoryGroupId, categoryGroupCollectionName)
    checkAccess(newData.categoryGroup, userId)
  }

  if (categoryUpdates.sharedWith) {
    newData.sharedWith = await idsToRef(categoryUpdates.sharedWith, usersCollectionName)
  }

  await categoryRef.update(newData);
  const updatedCategory = await refsToData(categoryRef);

  if (!updatedCategory) {
    throw new ApiError(HttpResponse.INTERNAL_SERVER_ERROR, "Category could not be updated.")
  }

  return updatedCategory
}

export const deleteCategory = async (categoryId: string, userId: string) => {
  const categoryRef = await idsToRef(categoryId, collectionName) as DocumentReference
  const category = await refsToData(categoryRef) as unknown as Category
  checkAccess(category, userId)
  await categoryRef.delete();
  return {
    id: categoryRef.id
  }
}