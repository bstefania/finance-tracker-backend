
import { PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User"

export class Category {
  @PrimaryGeneratedColumn()
  id!: string

  @Column()
  name!: string

  @ManyToOne(() => User, (user: User) => user.categories)
  createdBy: User
}
