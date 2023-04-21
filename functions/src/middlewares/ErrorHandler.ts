import { NextFunction, Request, Response } from "express"
import { Dictionary, HttpResponse } from "../types/General"
import { sendResponse } from "../utils/ResponseGenerator"

export class ApiError {
  status: HttpResponse
  message: string
  data: Dictionary | null = null

  constructor(status: HttpResponse, message: string, objectId?: string) {
    this.status = status
    this.message = message
    if (objectId) {
      this.data = {
        id: objectId,
      }
    }
  }
}

export const apiErrorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  let info
  if (err instanceof ApiError) {
    info = { ...err }
  } else if (err instanceof SyntaxError) {
    info = {
      status: HttpResponse.BAD_REQUEST,
      message: "Invalid syntax!",
    }
  } else {
    // don't use console.err in prod because it is not async
    console.error(err)
    info = {
      status: HttpResponse.INTERNAL_SERVER_ERROR,
      message: "Something went wrong!",
    }
  }

  sendResponse(info.status, info.message, info.data || null, res)
}
