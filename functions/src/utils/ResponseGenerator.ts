import { Response } from "express"
import { HttpResponse } from "../types/General"

export const toTitleCase = (text: string) => {
  const arr = text.split("_")
  const result = arr.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  )
  return result.join(" ")
}

export const sendResponse = (
  status: HttpResponse,
  message: string | null,
  data: any,
  res: Response
) => {
  const response = {
    status: status,
    title: toTitleCase(
      Object.keys(HttpResponse)[Object.values(HttpResponse).indexOf(status)]
    ),
    message: message,
    data: data,
  }
  res.status(response.status).json(response)
}
