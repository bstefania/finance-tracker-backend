
import { PrimaryGeneratedColumn, Column, ManyToOne, JoinTable, ManyToMany, Entity, Check } from "typeorm";
import { TransactionType } from "../../types/General"
import { SubCategory } from "./SubCategory"
import { User } from "./User"

@Entity()
@Check(`"amount" > 0`)
export class Transaction {
  @PrimaryGeneratedColumn()
  id!: string

  @ManyToOne(() => SubCategory, (subCategory: SubCategory) => subCategory.transactions)
  subCategory!: SubCategory

  @Column()
  amount!: number

  @ManyToOne(() => User, (user: User) => user.transactions)
  user!: User

  @ManyToMany(() => User)
  @JoinTable()
  sharedWith?: User[]

  @Column()
  createdAt?: Date
}
