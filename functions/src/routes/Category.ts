import express, { NextFunction, Request, Response } from "express"
import { createCategory } from "../controllers/Category"
import { CategoryInput } from "../types/General"
import { sendResponse } from "../utils/ResponseGenerator"
import { HttpResponse } from "../types/General"
// import { checkBody } from "../utils/validators/Validations"
// import {
//   CategoryPostDetails,
//   CategoryPatchDetails,
// } from "../utils/validators/CategoryValidations"

const router: express.Router = express.Router()

router.get(
  "/categories",
  async (_req: Request, res: Response, next: NextFunction) => {
    // try {
    //   const uid = _req.headers.uid as string
    //   const categories = await getCategories(uid)
    //   sendResponse(HttpResponse.OK, null, categories, res)
    // } catch (err) {
    //   next(err)
    // }
  }
)

router.get(
  "/categories/:categoryId",
  async (_req: Request, res: Response, next: NextFunction) => {
    // try {
    //   const id = _req.params.categoryId
    //   const uid = _req.headers.uid as string
    //   const categoryDetails = await controller.getCategory(id, uid)
    //   sendResponse(HttpResponse.OK, null, categoryDetails, res)
    // } catch (err) {
    //   next(err)
    // }
  }
)

router.post(
  "/categories",
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      // await checkBody(_req.body, CategoryPostDetails)
      const category: CategoryInput = _req.body
      const uid = _req.headers.uid as string
      const insertedCategory = await createCategory(category, uid)
      sendResponse(HttpResponse.CREATED, null, insertedCategory, res)
    } catch (err) {
      next(err)
    }
  }
)

// router.patch(
//   "/categories/:categoryId",
//   async (_req: Request, res: Response, next: NextFunction) => {
//     try {
//       // await checkBody(_req.body, CategoryPatchDetails)
//       const id = _req.params.categoryId
//       const category: Category = _req.body
//       const uid = _req.headers.uid as string
//       const updatedCategory = await controller.updateCategory(id, category, uid)
//       sendResponse(HttpResponse.OK, null, updatedCategory, res)
//     } catch (err) {
//       next(err)
//     }
//   }
// )

// router.delete(
//   "/categories/:categoryId",
//   async (_req: Request, res: Response, next: NextFunction) => {
//     try {
//       const id = _req.params.categoryId
//       const uid = _req.headers.uid as string
//       await controller.deleteCategory(id, uid)
//       sendResponse(HttpResponse.OK, null, { id }, res)
//     } catch (err) {
//       next(err)
//     }
//   }
// )

export default router
