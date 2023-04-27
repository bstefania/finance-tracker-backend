import { DocumentReference } from 'firebase-admin/firestore';
import { db } from "../../firebase"
import { ApiError } from "../../middlewares/ErrorHandler";
import { CategoryGroup, CategoryGroupInput, HttpResponse, User } from '../../types/General'
import { idsToRef, refsToData } from '../../utils/FirestoreData';

const collectionName = 'categoryGroups'
const usersCollectionName = 'users'


export const getCategoryGroups = async (userId: string) => {
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
      sharedWith: await refsToData(data.sharedWith) as User[],
    };
  }))
}

export const getCategoryGroup = async (
  categoryGroupId: string,
  userId: string
) => {
  const categoryGroupRef = await idsToRef(categoryGroupId, collectionName) as DocumentReference<FirebaseFirestore.DocumentData>
  const categoryGroup = await refsToData(categoryGroupRef) as unknown as CategoryGroup
  if (!categoryGroup || categoryGroup.owner.id !== userId) {
    throw new ApiError(HttpResponse.NOT_FOUND, "Category group not found.");
  }
  return categoryGroup
}

export const createCategoryGroup = async (categoryGroup: CategoryGroupInput, userId: string) => {
  const categoryGroupRef = await db.collection(collectionName).add({
    name: categoryGroup.name,
    owner: await idsToRef(userId, usersCollectionName),
    sharedWith: await idsToRef(categoryGroup.sharedWith, usersCollectionName),
  })
  if (!categoryGroupRef) {
    throw new ApiError(HttpResponse.INTERNAL_SERVER_ERROR, "Category group could not be created.")
  }

  return refsToData(categoryGroupRef);
}

export const updateCategoryGroup = async (
  categoryGroupId: string,
  categoryGroupUpdates: Partial<CategoryGroupInput>,
  userId: string
) => {
  const categoryGroupRef = await idsToRef(categoryGroupId, collectionName) as DocumentReference
  const categoryGroup = await refsToData(categoryGroupRef) as unknown as CategoryGroup;

  if (!categoryGroup) {
    throw new ApiError(HttpResponse.NOT_FOUND, "Category group doesn't exist.", categoryGroupId)
  }
  if (categoryGroup.owner.id !== userId) {
    throw new ApiError(HttpResponse.FORBIDDEN, "You don't have permission to update this category group.");
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
  const updatedCategoryGroup = await refsToData(categoryGroupRef);

  if (!updatedCategoryGroup) {
    throw new ApiError(HttpResponse.INTERNAL_SERVER_ERROR, "Category group could not be updated.")
  }

  return updatedCategoryGroup
}

export const deleteCategoryGroup = async (categoryGroupId: string, userId: string) => {
  const categoryGroupRef = await idsToRef(categoryGroupId, collectionName) as DocumentReference
  const categoryGroup = await refsToData(categoryGroupRef) as unknown as CategoryGroup
  if (!categoryGroup) {
    throw new ApiError(HttpResponse.NOT_FOUND, "Category group doesn't exist.", categoryGroupId)
  }

  if (categoryGroup.owner.id !== userId) {
    throw new ApiError(HttpResponse.FORBIDDEN, "You don't have permission to delete this category group.")
  }
  await categoryGroupRef.delete();
  return {
    id: categoryGroupRef.id
  }
}