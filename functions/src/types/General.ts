export enum TransactionType {
  Income = "Income",
  Expense = "Expense",
  Saving = "Saving",
  Investment = "Investment"
}

export type User = {
  id: string,
  name: string,
  email: string
} 

export type Transaction = {
  category: string,
  type: TransactionType,
  amount: number,
  date: Date,
  note: string
} 

export type CategoryGroupInput = {
  name: string;
  sharedWith: string[];
}

export type CategoryGroup = {
  id: string;
  name: string;
  owner: User;
  sharedWith: User[];
}

export type Category = {
  id: string;
  name: string;
  categoryGroup: CategoryGroup,
  owner: User;
  sharedWith: string[];
}

export type CategoryInput = {
  name: string;
  categoryGroupId: string,
  sharedWith: string[];
}

export enum Frequency {
  Monthly = "Monthly",
  Yearly = "Yearly"
}

export type Dictionary = {
  [key: string]: string
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

