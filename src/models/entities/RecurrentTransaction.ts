
import { PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, Entity, Check } from "typeorm";
import { Frequency, TransactionType } from "../../types/General";
import { SubCategory } from "./SubCategory";
import { User } from "./User";

@Entity()
@Check(`"amount" > 0`)
@Check(`"payDay" > 0 AND "payDay" < 31`)
@Check(`"payMonth" > 0 AND "payMonth" < 12`)
export class RecurrentTransaction {
  @PrimaryGeneratedColumn()
  id!: string
  
  @ManyToOne(() => SubCategory, (subCategory: SubCategory) => subCategory.recurrentTransactions)
  subCategory!: SubCategory

  @Column()
  frequency!: Frequency
  
  @Column()
  startDate!: Date
  
  @Column()
  endDate?: Date
  
  @Column()
  amount!: number
  
  @Column()
  payDay!: number
  
  @Column()
  payMonth?: number
  
  @ManyToOne(() => User, (user: User) => user.recurrentTransactions)
  owner!: User
  
  @ManyToMany(() => User)
  @JoinTable()
  sharedWith?: User[]
}
