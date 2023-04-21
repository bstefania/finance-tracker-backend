import { Response, NextFunction } from "express"
import { HttpResponse } from "../types/General"
import { CustomRequest } from "../types/General"
import { ApiError } from "./ErrorHandler"

export const verifyResourceAccess = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  next()
}