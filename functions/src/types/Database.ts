export enum TransactionType {
  Income = "income",
  Expense = "expense",
  Savings = "savings",
  Investments = "investments",
  Credit = "credit"
}

export type Wealth = {
  income: number,
  savings: number,
  investments: number,
  credit: number
}

export type User = {
  id: string,
  name: string,
  email: string,
  wealth: Wealth
} 

export type UserInput = {
  name: string,
  email: string,
  wealth: Wealth
}

export enum TransactionSource {
  Income = "income",
  Savings = "savings",
  Investments = "investments"
}

export type TransactionInput = {
  source: TransactionSource,
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
  source: TransactionSource,
  amount: number,
  createdAt: string | Date,
  note: string,
  owner: User,
  sharedWith: User[];
} 

export type CategoryGroupInput = {
  name: string,
  color: string,
  icon: string,
  sharedWith: string[],
}

export type CategoryGroup = {
  id: string,
  name: string,
  color: string,
  icon: string,
  owner: User,
  sharedWith: User[],
}

export type CategoryInput = {
  name: string,
  color: string,
  icon: string,
  categoryGroupId: string,
  sharedWith: string[],
}

export type Category = {
  id: string,
  name: string,
  color: string,
  icon: string,
  categoryGroup: CategoryGroup,
  owner: User,
  sharedWith: User[],
}
