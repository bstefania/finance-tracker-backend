import * as categoryOps from "../models/repositories/Category"
import { Category, CategoryInput } from "../types/General"

  export const getCategories = async (userId: string) => {
    // return categoryOps.getCategories(userId)
  }

  export const getCategory = async (id: string, userId: string) => {
    // return categoryOps.getCategory(id, userId)
  }

  export const createCategory = async (category: CategoryInput, userId: string) => {
    return categoryOps.createCategory(category, userId)
  }

  export const updateCategory = async (id: string, category: Category, userId: string) => {
    // return categoryOps.updateCategory(id, category, userId)
  }

  export const deleteCategory = async (id: string, userId: string) => {
    // return categoryOps.deleteCategory(id)
  }
