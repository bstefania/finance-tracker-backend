import { db } from "../../firebase"
import { ApiError } from "../../middlewares/ErrorHandler";
import { CategoryGroup, CategoryGroupInput, HttpResponse, User } from '../../types/General'

const collectionName = 'categoryGroups'
const usersCollectionName = 'users'

const refsToData = (refs: FirebaseFirestore.DocumentReference[]) => {
  return Promise.all(refs.map(async (ref: FirebaseFirestore.DocumentReference) => ({
    id: ref.id,
    ...(await ref.get()).data(),
  })))
}

const idsToRef = (ids: string[], collectionName: string) => {
  return ids.map((id) =>
    db.collection(collectionName).doc(id)
  )
}

export const getCategoryGroups = async (userId: string) => {
  const userDoc = db.collection(usersCollectionName).doc(userId)
  const querySnapshot = await db
    .collection(collectionName)
    .where('owner', '==', userDoc)
    .get();

  const userData = (await userDoc.get()).data()

  const categoryGroups: CategoryGroup[] = [];
  querySnapshot.forEach(async (ref) => {
    const data = ref.data();
    categoryGroups.push({
      id: ref.id,
      name: data.name,
      owner: userData as User,
      sharedWith: await refsToData(data.sharedWith) as User[],
    });
  });

  return categoryGroups;
}

export const getCategoryGroup = async (
  categoryGroupId: string,
  userId: string
) => {
  const categoryGroup = (await db.collection(collectionName).doc(categoryGroupId).get()).data()
  if (!categoryGroup || categoryGroup.owner.id !== userId) {
    throw new ApiError(HttpResponse.NOT_FOUND, "Category group not found.");
  }
  return {
    id: categoryGroup.id,
    name: categoryGroup.name,
    owner: (await categoryGroup.owner.get()).data() as User,
    sharedWith: await refsToData(categoryGroup.sharedWith) as User[]
  }
}

export const createCategoryGroup = async (categoryGroup: CategoryGroupInput, userId: string) => {
  const categoryGroupRef = await db.collection(collectionName).add({
    name: categoryGroup.name,
    owner: db.collection(usersCollectionName).doc(userId),
    sharedWith: idsToRef(categoryGroup.sharedWith, usersCollectionName),
  })

  const createdCategoryGroup = (await categoryGroupRef.get()).data();

  if (!createdCategoryGroup) {
    throw new ApiError(HttpResponse.INTERNAL_SERVER_ERROR, "Category group could not be created.")
  }

  const ownerRef = createdCategoryGroup.owner;
  const sharedWithRefs = createdCategoryGroup.sharedWith;
  const owner = {
    id: ownerRef.id,
    ...(await ownerRef.get()).data()
  }
  const sharedWith = await refsToData(sharedWithRefs)

  return {
    id: createdCategoryGroup.id,
    name: createdCategoryGroup.name,
    owner,
    sharedWith
  } as CategoryGroup;
}

export const updateCategoryGroup = async (
  categoryId: string,
  categoryGroupUpdates: Partial<CategoryGroupInput>,
  userId: string
) => {
  const categoryGroupRef = db.collection(collectionName).doc(categoryId);
  const categoryGroup = (await categoryGroupRef.get()).data();
  if (!categoryGroup || categoryGroup.owner.id !== userId) {
    throw new ApiError(HttpResponse.FORBIDDEN, "You don't have permission to update this category group.");
  }

  const newData: any = {};
  for (let [key, value] of Object.entries(categoryGroupUpdates)) {
    if (value !== undefined) {
      newData[key] = value;
    }
  }
  if (categoryGroupUpdates.sharedWith) {
    newData.sharedWith = idsToRef(categoryGroupUpdates.sharedWith, usersCollectionName)
  }

  await categoryGroupRef.update(newData);
  const updatedCategoryGroup = (await categoryGroupRef.get()).data();

  if (!updatedCategoryGroup) {
    throw new ApiError(HttpResponse.INTERNAL_SERVER_ERROR, "Category group could not be updated.")
  }

  const ownerRef = await updatedCategoryGroup.owner.get()
  const owner = {
    id: ownerRef.id,
    ...ownerRef.data()
  }

  return {
    id: updatedCategoryGroup.id,
    name: updatedCategoryGroup.name,
    owner,
    sharedWith: await refsToData(updatedCategoryGroup.sharedWith)
  }
}

export const deleteCategoryGroup = async (categoryGroupId: string, userId: string) => {
  const categoryGroupRef = db.collection(collectionName).doc(categoryGroupId);
  const categoryGroup = (await categoryGroupRef.get()).data() as CategoryGroup;
  if (categoryGroup.owner.id !== userId) {
    throw new ApiError(HttpResponse.FORBIDDEN, "You don't have permission to delete this category group.")
  }
  await categoryGroupRef.delete();
  return {
    id: categoryGroupRef.id
  }
}