import express, { NextFunction, Request, Response } from "express"
import * as controller from "../controllers/User"
import { sendResponse } from "../utils/ResponseGenerator"
import { HttpResponse } from "../types/General"

const router: express.Router = express.Router()

router.get(
  "/wealth",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const uid = _req.headers.uid as string
      const wealth = await controller.getWealth(uid)
      sendResponse(HttpResponse.OK, null, wealth, res)
    } catch (err) {
      next(err)
    }
  }
)

router.patch(
  "/wealth",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const wealth = _req.body
      const uid = _req.headers.uid as string
      const updatedWealth = await controller.updateWealth(wealth, uid)
      sendResponse(HttpResponse.OK, null, updatedWealth, res)
    } catch (err) {
      next(err)
    }
  }
)

export default router
