
import {PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinTable, ManyToMany, Entity} from "typeorm"
import {TransactionType} from "../../types/General"
import {Category} from "./Category"
import {Plan} from "./Plan"
import {RecurrentTransaction} from "./RecurrentTransaction"
import {Transaction} from "./Transaction"
import {User} from "./User"

@Entity()
export class SubCategory {
  @PrimaryGeneratedColumn()
    id!: string

  @Column()
    name!: string

  @ManyToOne(() => Category, (category: Category) => category.subcategories)
    category!: Category

  @Column()
    type!: TransactionType

  @ManyToOne(() => User, (user: User) => user.subcategories)
    owner?: User

  @ManyToMany(() => User)
  @JoinTable()
    sharedWith?: User[]

  @OneToMany(() => Transaction, (transaction: Transaction) => transaction.subCategory)
    transactions?: Transaction[]

  @OneToMany(() => RecurrentTransaction,
    (recurrentTransaction: RecurrentTransaction) => recurrentTransaction.subCategory)
    recurrentTransactions?: RecurrentTransaction[]

  @OneToMany(() => Plan, (plan: Plan) => plan.subCategory)
    plans?: Plan[]
}
