import { Entity, PrimaryGeneratedColumn, Column, OneToOne,JoinColumn } from "typeorm"

enum Status {
  Active = 1,
  Inactive = 0
}

@Entity('role')
export class Role  {
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
}
