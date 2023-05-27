import * as transactionOps from "../models/repositories/Transaction"
import { TransactionInput, TransactionType } from "../types/Database"

export const getTransactions = async (userId: string, queryParams: Record<string, string>) => {
    return transactionOps.getTransactions(userId, queryParams)
  }

  export const getTransaction = async (id: string, userId: string) => {
    return transactionOps.getTransaction(id, userId)
  }

  export const getTransactionTypes = () => {
    return Object.values(TransactionType)
  }

  export const createTransaction = async (transaction: TransactionInput, userId: string) => {
    return transactionOps.createTransaction(transaction, userId)
  }

  export const updateTransaction = async (id: string, transaction: Partial<TransactionInput>, userId: string) => {
    return transactionOps.updateTransaction(id, transaction, userId)
  }

  export const deleteTransaction = async (id: string, userId: string) => {
    return transactionOps.deleteTransaction(id, userId)
  }