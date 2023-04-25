import {v4 as uuidv4} from "uuid";
import {User} from "../Models/User";
import {Profile} from "../Models/Profile";
import axios from 'axios';

import bcrypt from 'bcrypt'
import Service from "../../libs/Service";
import {AppDataSource} from "../../config/database";

export default class UserService extends Service {
  private userRepository;
  private profileRepository;
  constructor(){
    super()
    this.userRepository = AppDataSource.getRepository(User);
    this.profileRepository = AppDataSource.getRepository(Profile);
  }
  async count() {
    try {
      const result = await this.userRepository.count()
      return result
    } catch (error) {
      return error
    }
  }

  async list() {
    try {
      const record = await this.userRepository.find()
      return record
    } catch (error) {
      return error
    }
  }

  async retrieve(id: number) {
    try {
    const records = await this.userRepository.findOne({where: {id: id}});
    return records;
    } catch (error) {
      return error
    }
  }

  async retrieveByEmail(email: string) {
    try {
    const records = await this.userRepository.findOne({where: {email: email}});
    return records;
    } catch (error) {
      return error
    }
  }
  async retrieveByMobileAndPassword(mobile_prefix:string,mobile: string,password:string) {
    try {
      const user = await this.userRepository.findOne({where: {
        mobile_phone_prefix:mobile_prefix,
        mobile_no: mobile
      }
    });
      if (!user) {
        return {
          "mobile_phone": mobile,
          "authenticated": false,
          "force_password_change": false,
          "user_type": "",
          "Doctors": []
        };
      }
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return {
          "mobile_phone": mobile,
          "authenticated": false,
          "force_password_change": false,
          "user_type": "",
          "Doctors": []
        };
      }
      return {
        "mobile_phone": mobile,
        "authenticated": true,
        "force_password_change": false,
        "user_type": "DOC/JR/AS",
        "Doctors": [
          user
        ]
      }
    } catch (error) {
      return error
    }
  }
  async sendOtp(mobile_phone: string) {
    try {
      var configRecaptcha = {
        method: 'get',
        url: `https://identitytoolkit.googleapis.com/v1/recaptchaParams?key=${process.env.FIREBASE_API_KEY}`
      };
      const recaptcha=(await axios(configRecaptcha)).data

      const url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/sendVerificationCode?key==${process.env.FIREBASE_API_KEY}`;
      const data = {
        phoneNumber: mobile_phone,
        recaptchaToken: recaptcha["recaptchaStoken"],
      };
      const config = {
        headers: { 'Content-Type': 'application/json' },
      };

      const result=(await axios.post(url, data, config)).data
      return result
    } catch (error) {
      return error
    }
  }
  async verifyOtp(code:string,session_key:string) {
    try {
      const url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPhoneNumber?key=${process.env.FIREBASE_API_KEY}`;
      const data = {
        code: code,
        sessionInfo: session_key,
      };
      const config = {
        headers: { 'Content-Type': 'application/json' },
      };
      const result=(await axios.post(url, data, config)).data
      return result
    } catch (error) {
      return error
    }
  }
  async comparePassword(email: string, enteredPassword:string) {
    try {
      const record = await this.userRepository.findOne({where: {email: email}});
      if(record!==null){
        const match = await bcrypt.compare(enteredPassword, record.password); 
        return match
      }else{
        return {"message":"user not found"}
      }
    } catch (error) {
      return error
    }
  }

  async create(data: any) {
    try {
      const date:Date = new Date(data.birth);
      const dateString = date.toISOString().substring(0, 19).replace('T', ' ');

      // const profile: Profile = new Profile()
      // profile.gender = data.profile.gender
      // profile.photo = data.profile.photo
      //Add new user
      let user: User = new User()
      user.first_name = data.first_name
      user.last_name = data.last_name
      user.mobile_phone_prefix=data.mobile_phone_prefix
      user.mobile_no=data.mobile_no
      user.gender=data.gender
      user.birth=dateString
      user.password = await user.hashPassword(data.password)
      // user.profile = profile
      const result = await this.userRepository.save(user)
      return result
    } catch (error) {
      return error
    }
  }

  async update(id: number, data: any) {
    try {
      const profile: Profile = new Profile()
      profile.gender = data.profile.gender
      profile.photo = data.profile.photo
      //Add new user
      let user: User = new User()
      user.id = id
      user.first_name = data.first_name
      user.last_name = data.last_name
      user.mobile_phone_prefix=data.mobile_phone_prefix
      user.mobile_no=data.mobile_no
      user.birth=data.birth
      user.gender=data.gender
      // user.profile = profile
      const result = await this.userRepository.save(user);
      return result
    } catch (error) {
      return error
    }
  }

  async delete(id: number) {
    try {
      const result = await this.userRepository.delete(id);
      return result
    } catch (error) {
      return error
    }
  }

  async datatable() {
    try{
      const records = await this.userRepository.find({
        order: {
          id: "ASC",
        },
        skip: 0,
        take: 10,
      });
      return records
    } catch (error) {
      return error
    }
  }
}