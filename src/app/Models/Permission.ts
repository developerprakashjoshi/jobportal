import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,JoinColumn } from "typeorm"
import { Role } from "./Role"
import bcrypt from 'bcrypt';


enum Status {
  Active = 1,
  Inactive = 0
}
@Entity('permission')
export class Permission  {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    name: string

    @Column()
    description: string

    @Column({
      type: "enum",
      enum: Status,
      default: Status.Active,
    })
    status: Status;

    @ManyToOne(() => Role,{cascade:true,eager:true})
    @JoinColumn()
    role_:Role
}
