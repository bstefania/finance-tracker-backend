import { DocumentReference } from "firebase-admin/firestore"

export enum Frequency {
  Monthly = "Monthly",
  Yearly = "Yearly"
}

export type Dictionary = {
  [key: string]: string
}

export type DocumentDetails = {
  [key: string]: string | DocumentReference
}

export enum HttpResponse {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_SERVER_ERROR = 500,
}

