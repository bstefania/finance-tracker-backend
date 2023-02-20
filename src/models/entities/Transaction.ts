
import { PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { TransactionType } from "../../types/General"
import { SubCategory } from "./SubCategory"
import { User } from "./User"

export class Transactions {
  @PrimaryGeneratedColumn()
  id!: string

  @Column()
  type!: TransactionType

  @ManyToOne(() => SubCategory, (subCategory: SubCategory) => subCategory.transactions)
  subCategory!: SubCategory

  @Column()
  amount!: number

  @ManyToOne(() => User, (user: User) => user.transactions)
  user!: User

  sharedWith?: User[]

  @Column()
  createdAt?: Date
}
