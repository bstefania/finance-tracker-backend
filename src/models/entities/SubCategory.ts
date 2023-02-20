
import { PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Category } from "./Category";

export class SubCategory {
  @PrimaryGeneratedColumn()
  id!: string

  @Column()
  name!: string

  @ManyToOne(() => Category, (category: Category) => category.subCategories)
  category!: Category

  @ManyToOne(() => User, (user: User) => user.subCategories)
  createdBy: User
}
