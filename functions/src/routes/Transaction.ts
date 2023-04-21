import express, { NextFunction, Request, Response } from "express"
import TransactionController from "../controllers/Transaction"
import { Transaction } from "../types/General"
import { sendResponse } from "../utils/ResponseGenerator"
import { HttpResponse } from "../types/General"
// import { checkBody } from "../utils/validators/Validations"
// import {
//   TransactionPostDetails,
//   TransactionPatchDetails,
// } from "../utils/validators/TransactionValidations"

const router: express.Router = express.Router()
const controller: TransactionController = new TransactionController()

router.get(
  "/transactions",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const uid = _req.headers.uid as string
      const transactions = await controller.getTransactions(uid)
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

router.post(
  "/transactions",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      // await checkBody(_req.body, TransactionPostDetails)
      const transaction: Transaction = _req.body
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
      // await checkBody(_req.body, TransactionPatchDetails)
      const id = _req.params.transactionId
      const transaction: Transaction = _req.body
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

export default router
