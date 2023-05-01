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

export type TransactionInput = {
  categoryId: string,
  type: TransactionType,
  amount: number,
  createdAt: Date,
  note: string,
  sharedWith: string[]
} 

export type Transaction = {
  id: string,
  category: Category,
  type: TransactionType,
  amount: number,
  createdAt: string | Date,
  note: string,
  owner: User,
  sharedWith: User[];
} 

export type CategoryGroupInput = {
  name: string,
  sharedWith: string[],
}

export type CategoryGroup = {
  id: string,
  name: string,
  owner: User,
  sharedWith: User[],
}

export type CategoryInput = {
  name: string,
  categoryGroupId: string,
  sharedWith: string[],
}

export type Category = {
  id: string,
  name: string,
  categoryGroup: CategoryGroup,
  owner: User,
  sharedWith: User[],
}
