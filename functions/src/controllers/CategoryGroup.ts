import * as categoryGroupOps from "../models/repositories/CategoryGroup"
import { CategoryGroupInput } from "../types/General"

  export const getCategoryGroups = async (userId: string) => {
    return categoryGroupOps.getCategoryGroups(userId)
  }

  export const getCategoryGroup = async (id: string, userId: string) => {
    return categoryGroupOps.getCategoryGroup(id, userId)
  }

  export const createCategoryGroup = async (category: CategoryGroupInput, userId: string) => {
    return categoryGroupOps.createCategoryGroup(category, userId)
  }

  export const updateCategoryGroup = async (id: string, category: Partial<CategoryGroupInput>, userId: string) => {
    return categoryGroupOps.updateCategoryGroup(id, category, userId)
  }

  export const deleteCategoryGroup = async (id: string, userId: string) => {
    return categoryGroupOps.deleteCategoryGroup(id, userId)
  }
