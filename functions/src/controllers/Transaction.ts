// import * as transactionOps from "../models/repositories/Transaction"
import { Transaction } from "../types/General"

export default class TransactionController {
  public async getTransactions(userId: string) {
    // return transactionOps.getTransactions(userId)
  }

  public async getTransaction(id: string, userId: string) {
    // return transactionOps.getTransaction(id, userId)
  }

  public async createTransaction(transaction: Transaction, userId: string) {
    // return transactionOps.createTransaction(transaction, userId)
  }

  public async updateTransaction(id: string, transaction: Transaction, userId: string) {
    // return transactionOps.updateTransaction(id, transaction, userId)
  }

  public async deleteTransaction(id: string, userId: string) {
    // return transactionOps.deleteTransaction(id)
  }
}
