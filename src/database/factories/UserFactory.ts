import { faker } from '@faker-js/faker';
import {Factory,FactorizedAttrs,LazyInstanceAttribute,SingleSubfactory} from '@jorgebodega/typeorm-factory'
import { User } from "../../app/Models/User"
import {AppDataSource} from "../../config/database";
export class UserFactory extends Factory<User> {
    protected entity = User
    protected dataSource = AppDataSource
    
    protected attrs(): FactorizedAttrs<User> {
      return {
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        password: faker.name.firstName(),
        mobile_phone_prefix:"+91",
        mobile_no:faker.phone(),
        birth:faker.date(),
      }
    }
  }