import { DocumentReference } from 'firebase-admin/firestore';
import { db } from "../../firebase"
import { ApiError } from "../../middlewares/ErrorHandler";
import { Category, CategoryGroup, CategoryInput, HttpResponse, User } from '../../types/General'
import { idsToRef, refsToData } from '../../utils/FirestoreData';

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
  if (!category || category.owner.id !== userId) {
    throw new ApiError(HttpResponse.NOT_FOUND, "Category not found.");
  }
  return category
}

export const createCategory = async (category: CategoryInput, userId: string) => {
  const categoryRef = await db.collection(collectionName).add({
    name: category.name,
    owner: await idsToRef(userId, usersCollectionName),
    categoryGroup: await idsToRef(category.categoryGroupId, categoryGroupCollectionName),
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

  if (!category) {
    throw new ApiError(HttpResponse.NOT_FOUND, "Category doesn't exist.", categoryId)
  }
  if (category.owner.id !== userId) {
    throw new ApiError(HttpResponse.FORBIDDEN, "You don't have permission to update this category.");
  }

  const newData: any = {};
  for (let [key, value] of Object.entries(categoryUpdates)) {
    if (value !== undefined && !key.endsWith("Id")) {
      newData[key] = value;
    }
  }
  if (categoryUpdates.categoryGroupId) {
    newData.categoryGroup = await idsToRef(categoryUpdates.categoryGroupId, categoryGroupCollectionName)
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
  if (!category) {
    throw new ApiError(HttpResponse.NOT_FOUND, "Category doesn't exist.", categoryId)
  }

  if (category.owner.id !== userId) {
    throw new ApiError(HttpResponse.FORBIDDEN, "You don't have permission to delete this category.")
  }
  await categoryRef.delete();
  return {
    id: categoryRef.id
  }
}