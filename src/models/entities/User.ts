
import { PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

export class User {
  @PrimaryGeneratedColumn()
  id!: string

  @Column()
  name!: string

  @OneToMany(() => SubCategory, (subCategory: SubCategory) => subCategory.recurrentTransactions)
  transactions: Transaction[]
 }
