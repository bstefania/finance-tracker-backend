
import { PrimaryGeneratedColumn, Column, OneToMany, OneToOne, Entity } from "typeorm";
import { Category } from './Category';
import { Plan } from './Plan';
import { RecurrentTransaction } from './RecurrentTransaction';
import { SubCategory } from './SubCategory';
import { Transaction } from './Transaction';
import { Wealth } from './Wealth';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: string

  @Column()
  name!: string

  @OneToOne(() => Wealth, (wealth: Wealth) => wealth.user)
  wealth!: Wealth

  @OneToMany(() => Category, (category: Category) => category.owner)
  categories?: Category[]

  @OneToMany(() => SubCategory, (subCategory: SubCategory) => subCategory.owner)
  subcategories?: SubCategory[]
  
  @OneToMany(() => Transaction, (transaction: Transaction) => transaction.user)
  transactions?: Transaction[]

  @OneToMany(() => RecurrentTransaction, (recurrentTransaction: RecurrentTransaction) => recurrentTransaction.owner)
  recurrentTransactions?: RecurrentTransaction[]

  @OneToMany(() => Plan, (plan: Plan) => plan.owner)
  plans?: Plan[]
 }
