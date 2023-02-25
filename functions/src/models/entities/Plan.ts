
import {PrimaryGeneratedColumn, Column, ManyToOne, JoinTable, ManyToMany, Entity, Check} from "typeorm"
import {Frequency} from "../../types/General"
import {SubCategory} from "./SubCategory"
import {User} from "./User"

@Entity()
@Check("\"amount\" > 0")
export class Plan {
  @PrimaryGeneratedColumn()
    id!: string

  @ManyToOne(() => SubCategory, (subCategory: SubCategory) => subCategory.plans)
    subCategory!: SubCategory

  @Column()
    frequency!: Frequency

  @Column()
    startDate!: Date

  @Column()
    endDate?: Date

  @Column()
    amount!: number

  @ManyToOne(() => User, (user: User) => user.plans)
    owner!: User

  @ManyToMany(() => User)
  @JoinTable()
    sharedWith?: User[]
}
