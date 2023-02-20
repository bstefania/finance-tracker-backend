
import { PrimaryGeneratedColumn, Column, OneToOne, Entity, Check } from "typeorm";
import { User } from './User';

@Entity()
@Check(`"wallet" >= 0`)
@Check(`"saving" >= 0`)
@Check(`"investment" >= 0`)
export class Wealth {
  @PrimaryGeneratedColumn()
  id!: string

  @OneToOne(() => User, (user: User) => user.wealth)
  user!: User

  @Column()
  wallet!: number

  @Column()
  saving!: number

  @Column()
  investment!: number
}
