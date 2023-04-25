import { Entity, PrimaryGeneratedColumn, Column, OneToOne,JoinColumn, ManyToOne } from "typeorm"
import { Profile } from "./Profile"
import { Address } from "./Address"
import bcrypt from 'bcrypt';

enum Gender {
  Male = 'M',
  Female = 'F',
  Other = 'O'
}

@Entity('user')
export class User  {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    mobile_phone_prefix:string

    @Column({length: 10})
    mobile_no:string

    @Column()
    password: string

    @Column({nullable:true})
    email: string

    @Column({nullable:true})
    reset_password_token:string
    
    @Column({nullable:true})
    reset_password_sent_at:Date

    @Column({nullable:true})
    remember_created_at:Date

    @Column({nullable:true})
    sign_in_count:number

    @Column({nullable:true})
    current_sign_in_at:Date

    @Column({nullable:true})
    last_sign_in_at:Date

    @Column({nullable:true})
    current_sign_in_ip:string

    @Column({nullable:true})
    last_sign_in_ip:string

    @Column({nullable:true})
    confirmation_token:string

    @Column({nullable:true})
    confirmed_at:string

    @Column({nullable:true})
    confirmation_sent_at:string
    
    @Column({default:true})
    onboarding_step:boolean

    @Column({nullable:true})
    language:string

    @Column({default:false})
    demo_account:boolean

    @Column({nullable:true})
    mobile_devise_id:string

    @Column({nullable:true})
    fcm_token:string

    @Column({nullable:true})
    last_request_at:Date

    @Column({nullable:true})
    logged_in:Date

    @Column()
    first_name: string

    @Column()
    last_name: string

    @Column({nullable:true})
    other_name:string

    @Column()
    birth:string

    @Column({nullable:true})
    otp:string

    @Column({
      type: "enum",
      enum: Gender,
      default:'M'
    })
    gender:Gender

    @Column({nullable:true})
    avtar:string
   
    @OneToOne(() => Profile,{cascade:true,eager:true})
    @JoinColumn()
    profile_:Profile

    

    async comparePassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }
    
    async hashPassword(password:string):Promise<string>{
      const salt=await bcrypt.genSalt(10)
      const hashPassword=await bcrypt.hash(password,salt)
      return hashPassword;
    }
}
