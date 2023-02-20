
import { PrimaryGeneratedColumn, Column } from "typeorm";
import { Frequency, TransactionType } from "../../types/General";
import { SubCategory } from "./SubCategory";
import { User } from "./User";

export class RecurrentTransaction {
  @PrimaryGeneratedColumn()
  id!: string

  @ManyToOne(() => User, (user: User) => user.recurrentTransactions)
  user!: User

  @ManyToOne(() => SubCategory, (subCategory: SubCategory) => subCategory.recurrentTransactions)
  subCategory!: SubCategory

  @Column()
  type!: TransactionType

  @Column()
  frequency!: Frequency

  @Column()
  startDate!: Date

  @Column()
  endDate?: Date

  @Column()
  amount!: number

  @Column()
  deadlineDay!: number
  
  @Column()
  deadlineMonth?: number
}
