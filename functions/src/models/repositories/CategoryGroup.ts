import { DocumentReference } from 'firebase-admin/firestore';
import { db } from "../../firebase"
import { ApiError } from "../../middlewares/ErrorHandler";
import { CategoryGroupInput, CategoryGroup, User } from '../../types/Database';
import { DocumentDetails, HttpResponse } from '../../types/General'
import { checkAccess, checkIfDataAlreadyExists, idsToRef, refsToData } from '../../utils/FirestoreData';

const collectionName = 'categoryGroups'
const usersCollectionName = 'users'

export const getCategoryGroups = async (userId: string) => {
  const userRef = await idsToRef(userId, usersCollectionName)
  const querySnapshot = await db
    .collection(collectionName)
    .where('owner', '==', userRef)
    // or where user is in sharedWith list
    .get();

  return Promise.all(querySnapshot.docs.map(async (ref) => {
    const data = ref.data();
    return {
      id: ref.id,
      name: data.name,
      color: data.color,
      icon: data.icon,
      owner:  await refsToData(userRef, usersCollectionName) as unknown as User,
      sharedWith: await refsToData(data.sharedWith, usersCollectionName) as unknown as User[],
    };
  }))
}

export const getCategoryGroup = async (
  categoryGroupId: string,
  userId: string
) => {
  const categoryGroupRef = await idsToRef(categoryGroupId, collectionName) as DocumentReference<FirebaseFirestore.DocumentData>
  const categoryGroup = await refsToData(categoryGroupRef, collectionName) as unknown as CategoryGroup
  checkAccess(categoryGroup, userId, collectionName)
  return categoryGroup
}

export const createCategoryGroup = async (categoryGroup: CategoryGroupInput, userId: string) => {
  const userRef = await idsToRef(userId, usersCollectionName) as DocumentReference
  const collection = db.collection(collectionName)

  const details: DocumentDetails = {
    name: categoryGroup.name
  }
  await checkIfDataAlreadyExists(details, userRef, collection, collectionName)

  const categoryGroupRef = await collection.add({
    name: categoryGroup.name,
    color: categoryGroup.color,
    icon: categoryGroup.icon,
    owner: userRef,
    sharedWith: await idsToRef(categoryGroup.sharedWith, usersCollectionName),
  })
  if (!categoryGroupRef) {
    throw new ApiError(HttpResponse.INTERNAL_SERVER_ERROR, "Category group could not be created.")
  }

  return refsToData(categoryGroupRef, collectionName);
}

export const updateCategoryGroup = async (
  categoryGroupId: string,
  categoryGroupUpdates: Partial<CategoryGroupInput>,
  userId: string
) => {
  const categoryGroupRef = await idsToRef(categoryGroupId, collectionName) as DocumentReference
  const categoryGroup = await refsToData(categoryGroupRef, collectionName) as unknown as CategoryGroup;

  checkAccess(categoryGroup, userId, collectionName)

  if (categoryGroupUpdates.name) {
    const details: DocumentDetails = {
      name: categoryGroupUpdates.name
    }
    const userRef = await idsToRef(userId, usersCollectionName) as DocumentReference
    const collection = db.collection(collectionName)
    await checkIfDataAlreadyExists(details, userRef, collection, collectionName)
  }

  const newData: any = {};
  for (let [key, value] of Object.entries(categoryGroupUpdates)) {
    if (value !== undefined) {
      newData[key] = value;
    }
  }
  if (categoryGroupUpdates.sharedWith) {
    newData.sharedWith = await idsToRef(categoryGroupUpdates.sharedWith, usersCollectionName)
  }

  await categoryGroupRef.update(newData);
  const updatedCategoryGroup = await refsToData(categoryGroupRef, collectionName)

  if (!updatedCategoryGroup) {
    throw new ApiError(HttpResponse.INTERNAL_SERVER_ERROR, "Category group could not be updated.")
  }

  return updatedCategoryGroup
}

export const deleteCategoryGroup = async (categoryGroupId: string, userId: string) => {
  const categoryGroupRef = await idsToRef(categoryGroupId, collectionName) as DocumentReference
  const categoryGroup = await refsToData(categoryGroupRef, collectionName) as unknown as CategoryGroup
  checkAccess(categoryGroup, userId, collectionName)
  await categoryGroupRef.delete()
  return {
    id: categoryGroupRef.id
  }
}