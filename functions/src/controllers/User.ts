import * as userOps from "../models/repositories/User"
import { UserInput } from "../types/Database"

export const getWealth = async (userId: string) => {
  return userOps.getWealth(userId)
}

export const updateWealth = async (wealth: Partial<UserInput>, userId: string) => {
  return userOps.updateWealth(wealth, userId)
}