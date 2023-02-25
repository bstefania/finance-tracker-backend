
import {PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, ManyToMany, JoinTable, Entity} from "typeorm"
import {SubCategory} from "./SubCategory"
import {User} from "./User"

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
    id!: string

  @Column()
    name!: string

  @OneToMany(() => SubCategory, (subcategory: SubCategory) => subcategory.category)
    subcategories?: SubCategory[]

  @ManyToOne(() => User, (user: User) => user.categories)
    owner?: User

  @ManyToMany(() => User)
  @JoinTable()
    sharedWith?: User[]
}
