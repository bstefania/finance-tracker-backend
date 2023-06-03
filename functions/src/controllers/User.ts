import * as userOps from "../models/repositories/User"
import { Wealth } from "../types/Database"

export const getWealth = async (userId: string) => {
  return userOps.getWealth(userId)
}

export const updateWealth = async (wealth: Wealth, userId: string) => {
  return userOps.updateWealth(wealth, userId)
}