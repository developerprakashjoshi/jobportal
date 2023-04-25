import {Seeder} from '@jorgebodega/typeorm-seeding'
import { DataSource } from 'typeorm';
import {User} from "../../app/Models/User";
import { UserFactory } from '../factories/UserFactory';
export default class UserSeeder extends Seeder {
    async run(dataSource: DataSource) {
        const users:User[]=await new UserFactory().createMany(10);
        await dataSource.createEntityManager().save<User>(users)
    }
  }