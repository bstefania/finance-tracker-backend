import { db } from "../../firebase"
import { Category, CategoryInput } from '../../types/General'

export const getCategories = async (userId: string) => {
  const querySnapshot = await db
    .collection('categories')
    .where('owner', '==', db.collection('users').doc(userId))
    .get();

  const categories: Category[] = [];
  querySnapshot.forEach((doc) => {
    const categoryData = doc.data();
    const sharedWithRefs = categoryData.sharedWith as FirebaseFirestore.DocumentReference[];
    const sharedWith: string[] = [];
    sharedWithRefs.forEach(async (sharedWithRef) => {
      const sharedWithData = (await sharedWithRef.get()).data();
      if (sharedWithData) sharedWith.push(sharedWithData.name);
    });
    categories.push({
      id: doc.id,
      name: categoryData.name,
      categoryGroup: categoryData.categoryGroup,
      owner: categoryData.owner,
      sharedWith: sharedWith,
    });
  });

  return categories;
}

export const createCategory = async (category: CategoryInput, userId: string): Promise<Category> => {
  const categoryRef = await db.collection('categories').add({
    name: category.name,
    categoryGroup: db.collection('categoryGroups').doc(category.categoryGroupId),
    owner: db.collection('users').doc(userId),
    sharedWith: category.sharedWith.map((sharedWithUserId) =>
      db.collection('users').doc(sharedWithUserId)
    ),
  });
  const newCategory = await categoryRef.get();
  return {
    id: newCategory.id,
    ...newCategory.data(),
  } as Category;
}

export const updateCategory = async (
  categoryId: string,
  categoryUpdates: Partial<Category>,
  userId: string
) => {
  // const categoryRef = db.collection('categories').doc(categoryId);
  // const category = (await categoryRef.get()).data() as Category;
  // if (category.owner.id !== userId) {
  //   throw new Error("You don't have permission to update this category.");
  // }
  // await categoryRef.update({
  //   ...categoryUpdates,
  //   sharedWith: categoryUpdates.sharedWith?.map((sharedWithUserId) =>
  //     db.collection('users').doc(sharedWithUserId)
  //   ),
  // });
  // const updatedCategory = await categoryRef.get();
  // return {
  //   id: updatedCategory.id,
  //   ...updatedCategory.data(),
  // } as Category;
}

export const deleteCategory = async (categoryId: string, userId: string) => {
  // const categoryRef = db.collection('categories').doc(categoryId);
  // const category = (await categoryRef.get()).data() as Category;
  // if (category.owner.id !== userId) {
  //   throw new Error("You don't have permission to delete this category.");
  // }
  // await categoryRef.delete();
}