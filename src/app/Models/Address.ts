import { Entity, PrimaryGeneratedColumn, Column,JoinColumn, ManyToOne } from "typeorm"
import { User } from "./User"

@Entity('address')
export class Address {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    street_line_one: string

    @Column()
    street_line_two: string

    @Column()
    postal_code: string

    @Column()
    city: string

    @Column()
    location: string

    @Column()
    state: string

    @Column()
    country: string

    @Column()
    type: string

    @ManyToOne(() => User,{cascade: true,eager: true})
    @JoinColumn()
    address_:User
}