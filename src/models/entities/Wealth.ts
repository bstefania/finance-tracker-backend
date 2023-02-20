
import { PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";

export class Wealth {
  @PrimaryGeneratedColumn()
  id!: string

  @OneToOne(() => User, (user: User) => user.wealth)
  user!: User

  @Column()
  wallet: number

  @Column()
  saving: number

  @Column()
  investment: number
}
