import express, { NextFunction, Request, Response } from "express"
import * as controller from "../controllers/CategoryGroup"
import { sendResponse } from "../utils/ResponseGenerator"
import { HttpResponse } from "../types/General"
import { CategoryGroupInput } from "../types/Database"

// import { checkBody } from "../utils/validators/Validations"
// import {
//   CategoryGroupPostDetails,
//   CategoryGroupPatchDetails,
// } from "../utils/validators/CategoryGroupValidations"

const router: express.Router = express.Router()

router.get(
  "/categoryGroups",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const uid = _req.headers.uid as string
      const categoryGroups = await controller.getCategoryGroups(uid)
      sendResponse(HttpResponse.OK, null, categoryGroups, res)
    } catch (err) {
      next(err)
    }
  }
)

router.get(
  "/categoryGroups/:categoryGroupId",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const id = _req.params.categoryGroupId
      const uid = _req.headers.uid as string
      const categoryGroupDetails = await controller.getCategoryGroup(id, uid)
      sendResponse(HttpResponse.OK, null, categoryGroupDetails, res)
    } catch (err) {
      next(err)
    }
  }
)

router.post(
  "/categoryGroups",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      // await checkBody(_req.body, CategoryGroupPostDetails)
      const categoryGroup: CategoryGroupInput = _req.body
      const uid = _req.headers.uid as string
      const insertedCategoryGroup = await controller.createCategoryGroup(categoryGroup, uid)
      sendResponse(HttpResponse.CREATED, null, insertedCategoryGroup, res)
    } catch (err) {
      next(err)
    }
  }
)

router.patch(
  "/categoryGroups/:categoryGroupId",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      // await checkBody(_req.body, CategoryGroupPatchDetails)
      const id = _req.params.categoryGroupId
      const categoryGroup: Partial<CategoryGroupInput> = _req.body
      const uid = _req.headers.uid as string
      const updatedCategoryGroup = await controller.updateCategoryGroup(id, categoryGroup, uid)
      sendResponse(HttpResponse.OK, null, updatedCategoryGroup, res)
    } catch (err) {
      next(err)
    }
  }
)

router.delete(
  "/categoryGroups/:categoryGroupId",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const id = _req.params.categoryGroupId
      const uid = _req.headers.uid as string
      await controller.deleteCategoryGroup(id, uid)
      sendResponse(HttpResponse.OK, null, { id }, res)
    } catch (err) {
      next(err)
    }
  }
)

export default router
