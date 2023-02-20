
import { PrimaryGeneratedColumn, Column } from "typeorm";
import { Frequency, TransactionType } from "../../types/General";

export class Plan {
  @PrimaryGeneratedColumn()
  id!: string

  @ManyToOne(() => User, (user: User) => user.plans)
  user!: User

  @Column()
  type!: TransactionType

  @Column()
  frequency!: Frequency

  @Column()
  startDate!: Date

  @Column()
  endDate: Date

  @Column()
  amount: number
}
