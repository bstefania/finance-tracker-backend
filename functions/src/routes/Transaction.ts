import express, { NextFunction, Request, Response } from "express"
import * as controller from "../controllers/Transaction"
import { sendResponse } from "../utils/ResponseGenerator"
import { HttpResponse } from "../types/General"
import { TransactionInput } from "../types/Database"

const router: express.Router = express.Router()

router.get(
  "/transactions",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const uid = _req.headers.uid as string
      const queryParams = _req.query as Record<string, string>
      const transactions = await controller.getTransactions(uid, queryParams)
      sendResponse(HttpResponse.OK, null, transactions, res)
    } catch (err) {
      next(err)
    }
  }
)

router.get(
  "/transactions/:transactionId",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const id = _req.params.transactionId
      const uid = _req.headers.uid as string
      const transactionDetails = await controller.getTransaction(id, uid)
      sendResponse(HttpResponse.OK, null, transactionDetails, res)
    } catch (err) {
      next(err)
    }
  }
)

router.get(
  "/transactionTypes",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const transactions = await controller.getTransactionTypes()
      sendResponse(HttpResponse.OK, null, transactions, res)
    } catch (err) {
      next(err)
    }
  }
)

router.post(
  "/transactions",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const transaction: TransactionInput = _req.body
      const uid = _req.headers.uid as string
      const insertedTransaction = await controller.createTransaction(transaction, uid)
      sendResponse(HttpResponse.CREATED, null, insertedTransaction, res)
    } catch (err) {
      next(err)
    }
  }
)

router.patch(
  "/transactions/:transactionId",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const id = _req.params.transactionId
      const transaction: Partial<TransactionInput> = _req.body
      const uid = _req.headers.uid as string
      const updatedTransaction = await controller.updateTransaction(id, transaction, uid)
      sendResponse(HttpResponse.OK, null, updatedTransaction, res)
    } catch (err) {
      next(err)
    }
  }
)

router.delete(
  "/transactions/:transactionId",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const id = _req.params.transactionId
      const uid = _req.headers.uid as string
      await controller.deleteTransaction(id, uid)
      sendResponse(HttpResponse.OK, null, { id }, res)
    } catch (err) {
      next(err)
    }
  }
)

router.get(
  "/amounts",
  async(_req: Request, res: Response, next: NextFunction) => {
    try {
      const uid = _req.headers.uid as string
      const filters = _req.query
      console.log(filters)
      const result = await controller.getAmounts(filters, uid)
      sendResponse(HttpResponse.OK, null, result, res)
    } catch (err) {
      next(err)
    }
  }
)
export default router
