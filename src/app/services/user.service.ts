import AppDataSource from '@config/mongoose';
import Service from '@libs/service';
import Response from '@libs/response';
import {Transporter} from "@config/mail";
import https from 'https';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken' 

import User,{Certificate, Address, Education,Experience } from '@models/user.schema';
import Apply from '@models/apply.schema';
import Account from '@models/account.schema';
import Recruiter from '@models/recruiter.schema';
import Jobs from '@models/job.schema';
import Interview from '@models/interview.schema';
import SearchEngine from '@libs/meili.search';
import { ObjectId } from 'mongodb';
import moment from 'moment';
import axios,{ AxiosRequestConfig } from 'axios';

export default class UserService extends Service {
  private userModel: any;
  private searchEngine: any;
  private recruiterModel: any;
  private applyModel: any;
  private jobsModel: any;
  private interviewModel: any;
  constructor() {
    super();
    this.searchEngine = new SearchEngine()
    this.userModel = User;
    this.recruiterModel = Recruiter;
    this.applyModel = Apply;
    this.jobsModel=Jobs;
    this.interviewModel=Interview
  }

  async count(): Promise<Response<any>> {
    try {
      const result = await this.userModel.countDocuments({ deletedAt: { $exists: false } });
      if (!result) {
        return new Response<any>(true, 200, 'Record not available', result);
      }
      return new Response<any>(true, 200, 'Count operation successful', result);
    } catch (error: any) {
      return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
    }
  }
  // If needed for chat messages
  async retrieveUsersByIds(userIds: string[]): Promise<Response<any>> {
    try {
      const result = await this.userModel.find({
        _id: { $in: userIds }, // Use $in operator to match documents with IDs in the userIds array
      });
  
      if (!result || result.length === 0) {
        return new Response<any>(true, 200, 'Record not available', []);
      }
  
      return new Response<any>(true, 200, 'Read operation successful', result);
    } catch (error: any) {
      return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
    }
  }
  async list(): Promise<Response<any>> {
    try {
      const result = await this.userModel.find();
      if (!result) {
        return new Response<any>(true, 200, 'Record not available', result);
      }
      return new Response<any>(true, 200, 'Read operation successful', result);
    } catch (error: any) {
      return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
    }
  }

  async listUsersByJobUser(jobUserId: string): Promise<Response<any>> {
    try {
      const jobsAndApplied = await this.jobsModel.aggregate([
        {
          $match: { 'recruiter': new ObjectId(jobUserId) }
        },
        {
          $lookup: {
            from: 'applies',
            localField: '_id',
            foreignField: 'job',
            as: 'appliedDetails'
          }
        },
        {
          $unwind: '$appliedDetails'
        },
        {
          $lookup: {
            from: 'users',
            localField: 'appliedDetails.user',
            foreignField: '_id',
            as: 'userDetails'
          }
        },
        {
          $unwind: '$userDetails'
        },
        {
          $project: {
            _id: 0,
            // title: 1,
            // reportToWork: 1,
            // createdBy: 1,
            // appliedDetails: 1,
            userDetails:1
          }
        }
      ]);
  
      if (!jobsAndApplied || jobsAndApplied.length === 0) {
        return new Response<any>(true, 200, 'No jobs found for the specified job user', []);
      }
  
      return new Response<any>(true, 200, 'Jobs and applied documents matching the specified job user', jobsAndApplied);
    } catch (error: any) {
      return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
    }
  }
  
  
  // async listUsersByJobUser(jobUserId: string): Promise<Response<any>> {
  //   try {
  //     const users = await this.jobsModel.aggregate([
  //       {
  //         $match: { 'createdBy': jobUserId }
  //       },
  //       {
  //         $lookup: {
  //           from: 'applied',
  //           localField: '_id',
  //           foreignField: 'job',
  //           as: 'appliedDetails'
  //         }
  //       },
  //       {
  //         $unwind: '$appliedDetails'
  //       },
  //       // {
  //       //   $lookup: {
  //       //     from: 'users',
  //       //     localField: 'appliedDetails.user',
  //       //     foreignField: '_id',
  //       //     as: 'userDetails'
  //       //   }
  //       // },
  //       // {
  //       //   $unwind: '$userDetails'
  //       // },
  //       {
  //         $project: {
  //           _id:1,
  //           title:1,
  //           appliedDetails:1,
  //         }
  //       }
  //     ]);
  
  //     if (!users || users.length === 0) {
  //       return new Response<any>(true, 200, 'No users found for the specified job user', []);
  //     }
  
  //     return new Response<any>(true, 200, 'Users matching the specified job user', users);
  //   } catch (error: any) {
  //     return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
  //   }
  // }
  


  async retrieve(pid: string): Promise<Response<any>> {
    try {
      const isValidObjectId = ObjectId.isValid(pid);
      if (!isValidObjectId) {
        return new Response<any>(false, 400, 'Invalid ObjectId', undefined);
      }
      const record = await this.userModel.findById(pid);
      if (!record) {
        return new Response<any>(true, 200, 'Record not available', record);
      }
      return new Response<any>(true, 200, 'Read operation successful', record);
    } catch (error: any) {
      return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
    }
  }

  async retrieveQualification(pid: string): Promise<Response<any>> {
    try {
      console.log(pid);
      const isValidObjectId = ObjectId.isValid(pid);
      if (!isValidObjectId) {
        return new Response<any>(false, 400, 'Invalid ObjectId', undefined);
      }
      const record = await this.userModel.findById(pid);
      if (!record) {
        return new Response<any>(true, 200, 'Record not available', record);
      }
      const output= record.education.map((row:any)=>{
        return row.course
      })
      return new Response<any>(true, 200, 'Read operation successful', output);
    } catch (error: any) {
      return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
    }
  }

  async retrieveByUser(name: string): Promise<any> {
    try {
      const records = await this.userModel.findOne({ name: name });
      return records;
    } catch (error: any) {
      return error;
    }
  }

  async comparePassword(password: string, dbpassword:string): Promise<boolean>{
    return bcrypt.compare(password, dbpassword);
  }

  async hashPassword(password:string):Promise<string>{
  const salt=await bcrypt.genSalt(10)
  const hashPassword=await bcrypt.hash(password,salt)
  return hashPassword;
  }

  async retrieveUserByEmailandPassword(email: string,password:string): Promise<Response<any>> {
    try {
      const record = await this.userModel.findOne({email: email, deletedAt: null });
      if (!record) {
        const response={
          token:"",
          authentication:false
        };
        return new Response<any>(false, 401, 'Incorrect credentials', response);
      }
      const isValidPassword = await this.comparePassword(password,record.password);
      if (!isValidPassword) {
        const response={
          token:"",
          authentication:false
        };
        return new Response<any>(false, 401, 'Incorrect credentials', response);
      }
      const jwtPayload = JSON.stringify({_id: record._id,type: 'candidate'});
      const token = jwt.sign(jwtPayload, process.env.JWT_SECRET_KEY || '');
      const response=record.toObject()
      delete response.password
      delete response.addresses
      delete response.education
      delete response.experiences 
      delete response.certificates
      delete response.createdAt
      delete response.createdBy
      delete response.createdFrom
      delete response.__v
      response.token=token
      response.authentication=true
      return new Response<any>(true, 200, 'Authentication successful', response);
    } catch (error: any) {
      return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
    }
  }

  async  fetchData(email:string,password:string) {
    const data = JSON.stringify({
      email: email,
      password: password,
    });
  
    const agent = new https.Agent({
      rejectUnauthorized: false, // Disable SSL certificate verification
    });

    const config: AxiosRequestConfig = {
      method: 'post',
      url: 'https://simapi.simandhareducation.com/userAuth/auth/studentSignIn',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
      httpsAgent: agent,
    };
  
    try {
      const response = await axios.request(config);
      console.log("RESPONSE")
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log("ERRRO")
      console.error(error);
      return null;
    }
  }
  

  async adminLogin(email: string,password:string): Promise<Response<any>> {
    try {
      let response=await this.fetchData(email, password);
      if(response !==null){
         const jwtPayload = JSON.stringify({_id: "admin",type: 'admin'});
         const token = jwt.sign(jwtPayload, process.env.JWT_SECRET_KEY || '');
         response.token=token;
      }
      return new Response<any>(true, 200, 'Authentication successful', response);
    } catch (error: any) {
      return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
    }
  }

  async updatePassword(userId:string,newPassword:string): Promise<Response<any>> {
    try {
      const isValidObjectId = ObjectId.isValid(userId);
      if (!isValidObjectId) {
        return new Response<any>(false, 400, 'Invalid ObjectId', undefined);
      }
      const user = await this.userModel.findById(userId);
      if (!user) {
          return new Response<any[]>(false, 404, "User not found", undefined);
      }

      user.password =await  this.hashPassword(newPassword); // Or you can use an empty string: user.curriculumVitae = "";
      user.updatedAt=new Date();
      user.updatedBy="Self";

      const result = await user.save();
      
      return new Response<any>(true, 200, 'Successfully password updated', result);
    } catch (error: any) {
      return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
    }
  }

  async updatePhoneVerify(userId:string,isPhoneVerify:boolean): Promise<Response<any>> {
    try {
      const isValidObjectId = ObjectId.isValid(userId);
      if (!isValidObjectId) {
        return new Response<any>(false, 400, 'Invalid ObjectId', undefined);
      }
      const user = await this.userModel.findById(userId);
      if (!user) {
          return new Response<any[]>(false, 404, "User not found", undefined);
      }

      user.isPhoneVerified =isPhoneVerify
      user.updatedAt=new Date();
      user.updatedBy="Self";
      
      const result = await user.save();
      
      return new Response<any>(true, 200, 'Successfully password updated', result);
    } catch (error: any) {
      return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
    }
  }

  async updateEmailVerify(userId:string,isEmailVerify:boolean): Promise<Response<any>> {
    try {
      const isValidObjectId = ObjectId.isValid(userId);
      if (!isValidObjectId) {
        return new Response<any>(false, 400, 'Invalid ObjectId', undefined);
      }
      const user = await this.userModel.findById(userId);
      if (!user) {
          return new Response<any[]>(false, 404, "User not found", undefined);
      }

      user.isEmailVerify =isEmailVerify
      user.updatedAt=new Date();
      user.updatedBy="Self";
      
      const result = await user.save();
      
      return new Response<any>(true, 200, 'Successfully password updated', result);
    } catch (error: any) {
      return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
    }
  }

  async forgotPassword(email:string,redirectUrl:string): Promise<Response<any>> {
    try {
      const user = await this.userModel.findOne({email:email});
      if (!user) {
          return new Response<any[]>(false, 404, "User not found", undefined);
      }

      let from=process.env.EMAIL_FROM
      let to=email
      let subject="Forgot Password"
      let text="Please click the given link to reset your password. "+redirectUrl+"?token="+user._id
    
      const message = {from,to,subject,text};

      const result = await Transporter.sendMail(message);
      return new Response<any>(true, 200, 'Successfully email send', {email:email,redirectUrl:text});
    } catch (error: any) {
      return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
    }
  }
  async sendEmailOTP(email:string): Promise<Response<any>> {
    try {
      const otp = Math.floor(1000 + Math.random() * 9000);
      let from=process.env.EMAIL_FROM
      let to=email
      let subject="OTP Verification"
      let text="Your OTP Verification code  is:" + otp
    
      const message = {from,to,subject,text};
      console.log(message);
      const result = await Transporter.sendMail(message);
      console.log(result);
      return new Response<any>(true, 200, 'Successfully email send', {email:email,otp:otp});
    } catch (error: any) {
      return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
    }
  }
  async create(data: any): Promise<Response<any>> {
    const existEmail = await this.userModel.findOne({ email: data.email });
      if (existEmail) {
        return new Response<any>(false, 400, 'Email already exists', undefined);
      }
      const existRecruiterEmail = await this.recruiterModel.findOne({ email: data.email });
      if(existRecruiterEmail) {
      return new Response<any[]>(false, 409, "Email already exists");
      }
    try {
      const account = new Account()
      account.email = data.email
      account.username=data.firstName+' '+data.lastName
      account.type = 'student'
      await account.save();
      
      const user = new User();
      user.firstName = data.firstName;
      user.lastName =data.lastName;
      user.email= data.email;
      user.phoneNo= data.phoneNo;
      user.password=await this.hashPassword(data.password);
      user.termsConditions=data.termsConditions;
      user.type=data.type;
      user.onboardingStep=1;
      user.createdAt = new Date();
      user.createdBy = "self"
      user.createdFrom = data.ip
      // await this.searchEngine.addDocuments('user', user);
      const result:any = await user.save();

      const jwtPayload = JSON.stringify({_id: result._id,type: 'candidate'});
      const token = jwt.sign(jwtPayload, process.env.JWT_SECRET_KEY || '');
      const response=result.toObject()
      // delete response.password
      // delete response.addresses
      // delete response.education
      // delete response.experiences 
      // delete response.certificates
      // delete response.createdAt
      // delete response.createdBy
      // delete response.createdFrom
      // delete response.__v
      response.token=token
      response.authentication=true
      return new Response<any>(true, 201, 'Insert operation successful',response);
      
    } catch (error:any) {
      return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
    }
  }
  async updateCurriculumVitae(pid: string,path:string):Promise<Response<any[]>> {
    try{
    const isValidObjectId = ObjectId.isValid(pid);
      if (!isValidObjectId) {
        return new Response<any[]>(false, 400, "Invalid ObjectId", undefined);
      }
      let id = new ObjectId(pid);
      const user = await this.userModel.findById(pid);
      user.curriculumVitae=path
      user.onboardingStep=2;
      user.updatedAt = new Date()
      user.updatedBy = "Self"
      user.updatedFrom ="127.0.0.1"
      const result = await user.save();
     
      return new Response<any[]>(true, 200, "Update operation successful", result);
    }
      catch (error: any) {
        return new Response<any[]>(false, 400, error.message);
      }
      
  }
  async deleteCurriculumVitae(pid: string): Promise<Response<any[]>> {
    try {
        const isValidObjectId = ObjectId.isValid(pid);
        if (!isValidObjectId) {
            return new Response<any[]>(false, 400, "Invalid ObjectId", undefined);
        }

        const user = await this.userModel.findById(pid);
        if (!user) {
            return new Response<any[]>(false, 404, "User not found", undefined);
        }

        user.curriculumVitae = null; // Or you can use an empty string: user.curriculumVitae = "";
        user.deletedAt=new Date();
        user.deleteBy="Self";

        const result = await user.save();

        return new Response<any[]>(true, 200, "Delete operation successful", result);
    } catch (error: any) {
        return new Response<any[]>(false, 500, error.message);
    }
}

  async updateCertificate(pid: string,path:string):Promise<Response<any[]>> {
    try{
    const isValidObjectId = ObjectId.isValid(pid);
      if (!isValidObjectId) {
        return new Response<any[]>(false, 400, "Invalid ObjectId", undefined);
      }
      let id = new ObjectId(pid);
      const user = await this.userModel.findById(pid);
      const certificate: Certificate = {file: path};
      user.certificates.push(certificate);
      user.onboardingStep=6;
      const result = await user.save();
      return new Response<any[]>(true, 200, "Update operation successful", result);
    }
      catch (error: any) {
        return new Response<any[]>(false, 400, error.message);
      }
      
  }


  async updateAvatar(pid: string,path:string):Promise<Response<any[]>> {
    try{
    const isValidObjectId = ObjectId.isValid(pid);
      if (!isValidObjectId) {
        return new Response<any[]>(false, 400, "Invalid ObjectId", undefined);
      }
      let id = new ObjectId(pid);
      const users = await this.userModel.findById(pid);
      users.avatar = path
      const result = await users.save();
      return new Response<any[]>(true, 200, "Update operation successful", result);
    }
      catch (error: any) {
        return new Response<any[]>(false, 400, error.message);
      }
      
  }
  async updateBasicInfo(pid: string, data: any): Promise<Response<any>> {
    try {
      
      const isValidObjectId = ObjectId.isValid(pid);
      if (!isValidObjectId) {
        return new Response<any>(false, 400, 'Invalid ObjectId', undefined);
      }
      const user = await this.userModel.findById(pid);
      if (!user) {
        return new Response<any>(true, 200, 'Record not available', user);
      }
      if (data.firstName) {
        user.firstName = data.firstName;
      }
      if (data.lastName) {
        user.lastName = data.lastName;
      }
      if (data.email) {
      user.email = data.email;
        // user.email = data.email;
      }
      if (data.phoneNo) {
        user.phoneNo = data.phoneNo;
      }
      user.onboardingStep=3;
      user.updatedAt = new Date()
      user.updatedBy = data.updatedBy
      user.updatedFrom = data.ip
      // await this.searchEngine.updateIndex('user', user);
      const result = await user.save();
      
      return new Response<any>(true, 200, 'Update operation successful', result);
    } catch (error: any) {
      return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
    }
  }

  async updateAddress(pid: string, data: any): Promise<Response<any>> {
    try {
      const isValidObjectId = ObjectId.isValid(pid);
      if (!isValidObjectId) {
        return new Response<any>(false, 400, 'Invalid ObjectId', undefined);
      }
      const user = await this.userModel.findById(pid);
      if (!user) {
        return new Response<any>(true, 200, 'Record not available', user);
      }
      if (!user.address) {
        user.address = [];
      }
      const updateAddress: Address[] = data.map((addressData:any) => {
        const address: Address = {
          street: addressData.street || "",
          country: addressData.country || "",
          state: addressData.state || "",
          city: addressData.city || "",
          postalCode: addressData.postalCode || 0,
          type: addressData.type || "",
        };
        return address;
      });
      
      user.updatedAt = new Date();
      user.updatedBy = data[0].updatedBy || ""; // Assuming the first address's updatedBy applies to all
      user.updatedFrom = data[0].ip || ""; // Assuming the first address's ip applies to all
      user.onboardingStep = 3;
      user.addresses=updateAddress;
      // await this.searchEngine.updateIndex('user', user);
      const result = await user.save();
      
      return new Response<any>(true, 200, 'Update operation successful', result);
    } catch (error: any) {
      return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
    }
  }


  async updateEducation(pid: string, data: any[]): Promise<Response<any>> {
  try {
    const isValidObjectId = ObjectId.isValid(pid);
    if (!isValidObjectId) {
      return new Response<any>(false, 400, 'Invalid ObjectId', undefined);
    }
    const user = await this.userModel.findById(pid);
    if (!user) {
      return new Response<any>(true, 200, 'Record not available', user);
    }
    if (!user.education) {
      user.education = [];
    }

    const updatedEducations: Education[] = data.map((educationData) => {
      const education: Education = {
        level: educationData.level || "",
        fieldStudy: educationData.fieldStudy || "",
        instituteName: educationData.instituteName || "",
        board: educationData.board || "",
        passingYear: educationData.passingYear || 0,
        state: educationData.state || "",
        city: educationData.city || "",
        course:educationData.course || "",
        courseType:educationData.courseType || "",
        courseSpecialization:educationData.courseSpecialization || "",
        certificate:educationData.certificate || "",
      };
      return education;
    });

    user.updatedAt = new Date();
    user.updatedBy = data[0].updatedBy;
    user.updatedFrom = data[0].ip;
    user.onboardingStep = 4;
    user.education = updatedEducations;

    // await this.searchEngine.updateIndex('user', user);
    const result = await user.save();

    return new Response<any>(true, 200, 'Update operation successful', result);
  } catch (error: any) {
    return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
  }
}


async  updateWorkExperience(pid: string, data: any[]): Promise<Response<any>> {
  try { 
    const isValidObjectId = ObjectId.isValid(pid);
    if (!isValidObjectId) {
      return new Response<any>(false, 400, 'Invalid ObjectId', undefined);
    }
    const user = await this.userModel.findById(pid);
    if (!user) {
      return new Response<any>(true, 200, 'Record not available', user);
    }
    
    const newExperiences: Experience[] = data.map(experienceData => ({
      jobTitle: experienceData.jobTitle || "",
      companyName: experienceData.companyName || "",
      currentlyWorking: experienceData.currentlyWorking || false,
      fromMonth: experienceData.fromMonth || "",
      fromYear: experienceData.fromYear || "",
      toMonth: experienceData.toMonth || "",
      toYear: experienceData.toYear || "",
      description: experienceData.description || ""
    }));

    if (!user.experiences) {
      user.experiences = [];
    }
    
    user.experiences=newExperiences;
    user.updatedAt = new Date();
    user.updatedBy = data[0].updatedBy; // Assuming the first experience's updatedBy applies to all
    user.updatedFrom = data[0].ip; // Assuming the first experience's ip applies to all
    user.onboardingStep = 5;
    // await this.searchEngine.updateIndex('user', user);
    const result = await user.save();

    return new Response<any>(true, 200, 'Update operation successful', result);
  } catch (error: any) {
    return new Response<any>(false, 500, 'Internal Server Error', undefined, error.message);
  }
}

  async updateSkillSets(pid: string, data: any): Promise<Response<any>> {
    try {
      const isValidObjectId = ObjectId.isValid(pid);
      if (!isValidObjectId) {
        return new Response<any>(false, 400, 'Invalid ObjectId', undefined);
      }
      const user = await this.userModel.findById(pid);
      if (!user) {
        return new Response<any>(true, 200, 'Record not available', user);
      }
      if (data.skillSets) {
        user.skillSets = data.skillSets;
      }
      if (data.recommendationSets) {
        user.recommendationSets = data.recommendationSets;
      }
      user.updatedAt = new Date()
      user.updatedBy = data.updatedBy
      user.updatedFrom = data.ip
      user.onboardingStep=6;
      // await this.searchEngine.updateIndex('user', user);
      const result = await user.save();
      
      return new Response<any>(true, 200, 'Update operation successful', result);
    } catch (error: any) {
      return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
    }
  }

  async updateConfirmStatus(pid: string, data: any): Promise<Response<any>> {
    try {
      const isValidObjectId = ObjectId.isValid(pid);
      if (!isValidObjectId) {
        return new Response<any>(false, 400, 'Invalid ObjectId', undefined);
      }
      const user = await this.userModel.findById(pid);
      if (!user) {
        return new Response<any>(true, 200, 'Record not available', user);
      }
      user.updatedAt = new Date()
      user.updatedBy = data.updatedBy
      user.updatedFrom = data.ip
      user.isReady = true;
      user.onboardingStep=7;
      // await this.searchEngine.updateIndex('user', user);
      const result = await user.save();
      
      return new Response<any>(true, 200, 'Update operation successful', result);
    } catch (error: any) {
      return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
    }
  }


  async update(pid: string, data: any): Promise<Response<any>> {
    try {
      const isValidObjectId = ObjectId.isValid(pid);
      if (!isValidObjectId) {
        return new Response<any>(false, 400, 'Invalid ObjectId', undefined);
      }
      const user = await this.userModel.findById(pid);
      if (!user) {
        return new Response<any>(true, 200, 'Record not available', user);
      }
      if (data.name) {
        user.name = data.name;
      }
      if (data.description) {
        user.description = data.description;
      }
      if (data.status) {
        user.status = data.status;
      }
      user.updatedAt = new Date()
      user.updatedBy = data.updatedBy
      user.updatedFrom = data.ip
      await this.searchEngine.updateIndex('user', user);
      const result = await user.save();
      
      return new Response<any>(true, 200, 'Update operation successful', result);
    } catch (error: any) {
      return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
    }
  }

  async delete(pid: string, data: any): Promise<Response<any>> {
    try {
      const isValidObjectId = ObjectId.isValid(pid);
      if (!isValidObjectId) {
        return new Response<any>(false, 400, 'Invalid ObjectId', undefined);
      }
      const user = await this.userModel.findById(pid);
      if (!user) {
        return new Response<any>(true, 200, 'Record not available');
      }
      user.deletedAt = moment().toDate();
      user.deleteBy = data.deleteBy;
      user.deleteFrom = data.ip;
      // await this.searchEngine.deleteDocument('user', pid);
      const result = await user.save();
      return new Response<any>(true, 200, 'Delete operation successful', result);
    } catch (error: any) {
      return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
    }
  }

  async test(data: any): Promise<Response<any>> {
    try {
      let { page, limit, search, sort,token } = data;
      let errorMessage = '';

      if (page !== undefined && limit !== undefined) {
        if (isNaN(page) || !Number.isInteger(Number(page)) || isNaN(limit) || !Number.isInteger(Number(limit))) {
          errorMessage = "Both 'page' and 'limit' must be integers.";
        }
      } else if (page !== undefined) {
        if (isNaN(page) || !Number.isInteger(Number(page))) {
          errorMessage = "'page' must be an integer.";
        }
      } else if (limit !== undefined) {
        if (isNaN(limit) || !Number.isInteger(Number(limit))) {
          errorMessage = "'limit' must be an integer.";
        }
      }

      if (errorMessage) {
        return new Response<any>(false, 400, errorMessage);
      }

      let searchQuery = {};
      if (search !== undefined) {
        searchQuery = {
          $or: [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        };
      }

      let sortQuery = {};
      if (sort !== undefined) {
        const sortParams = sort.split(':');
        if (sortParams.length === 2) {
          const [column, order] = sortParams;
          sortQuery = { [column]: order === 'desc' ? -1 : 1 };
        }else{
          sortQuery = { createdAt:-1 };
        }
      }

      page = page === undefined ? 1 : parseInt(page);
      limit = limit === undefined ? 10 : parseInt(limit);
      const skip = (page - 1) * limit;
      const [records, totalCount] = await Promise.all([
        this.userModel.aggregate([
          {
            $match: {
              $and: [
                searchQuery,
                { deletedAt: null } // Filter out documents where deletedAt is not null
              ]
            }
          },
          ...(Object.keys(sortQuery).length > 0 ? [{ $sort: sortQuery }] : []),
          {
            $skip: skip
          },
          {
            $limit: limit
          },
          {
            $lookup: {
              from: 'applies',
              localField: '_id',
              foreignField: 'user',
              as: 'apply',
            },
          },
          // { $unwind: '$apply' },
          
          {
            $addFields: {
              fullName: { $concat: ["$firstName", " ", "$lastName"] },
              designation: { $arrayElemAt: ["$experiences.jobTitle", -1] }, 
            
              interviewSchedule:false,
              jobStatus:{
                $arrayElemAt:['$apply.status',0],
              },
              city: {
                $ifNull: [
                  { $arrayElemAt: ["$addresses.city", 0] }, // Corrected: Access the first element of the addresses array
                  ""
                ]
              },
             
              experience: {
                $subtract: [
                  {
                    $toInt: {
                      $cond: [
                        { $and: [{ $ne: [{ $arrayElemAt: ["$experiences.toYear", 0] }, ""] }, { $ne: [{ $arrayElemAt: ["$experiences.toYear", 0] }, null] }] },
                        { $arrayElemAt: ["$experiences.toYear", 0] },
                        0
                      ]
                    }
                  },
                  {
                    $toInt: {
                      $cond: [
                        { $and: [{ $ne: [{ $arrayElemAt: ["$experiences.fromYear", 0] }, ""] }, { $ne: [{ $arrayElemAt: ["$experiences.fromYear", 0] }, null] }] },
                        { $arrayElemAt: ["$experiences.fromYear", 0] },
                        0
                      ]
                    }
                  }
                ]
              }
            }
          },
          {
            $project: {
              _id: 1,
              firstName: 1,
              lastName: 1,
              fullName: 1,
              email:1,
              phoneNo:1,
              curriculumVitae: 1,
              designation:1,
              city: 1,
              experience: 1,
              interviewSchedule:1,
              jobStatus: 1,
              createdAt:1
            }
          }
        ])
        .exec()
        ,
        this.userModel.countDocuments({ deletedAt: { $exists: false } }),
      ]);
      console.log(records, totalCount)
      if (records.length === 0) {
        return new Response<any>(true, 200, 'No records available', {});
      }

      const userIds = records.map((record:any) => record._id.toString());
      const totalAppliedCounts = await Promise.all(userIds.map((_id:string) => this.getTotalAppliedJobsByUser(_id)));
      records.forEach((record:any, index:number) => {
        record.totalApplied = totalAppliedCounts[index];
      });

      const appliedJobsByUser = await Promise.all(userIds.map((_id:string) => this.getAppliedJobsByUser(_id)));
      records.forEach((record:any, index:number) => {
        record.appliedFor = appliedJobsByUser[index];
      });

      const totalPages = Math.ceil(totalCount / limit);
      const currentPage = page;
      const output = {
        records: records,
        totalPages: totalPages !== null ? totalPages : 0,
        currentPage: currentPage !== null ? currentPage : 0,
        filterCount: records.length,
        totalCount: totalCount,
      };
      return new Response<any>(true, 200, 'Read operation successful', output);
    } catch (error: any) {
      return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
    }
  }

  async datatableAdmin(data: any): Promise<Response<any>> {
    console.log("HERE")
    try {
      let { page, limit, search, sort,name,email,job,designation,city } = data;
      let errorMessage = '';

      if (page !== undefined && limit !== undefined) {
        if (isNaN(page) || !Number.isInteger(Number(page)) || isNaN(limit) || !Number.isInteger(Number(limit))) {
          errorMessage = "Both 'page' and 'limit' must be integers.";
        }
      } else if (page !== undefined) {
        if (isNaN(page) || !Number.isInteger(Number(page))) {
          errorMessage = "'page' must be an integer.";
        }
      } else if (limit !== undefined) {
        if (isNaN(limit) || !Number.isInteger(Number(limit))) {
          errorMessage = "'limit' must be an integer.";
        }
      }

      if (errorMessage) {
        return new Response<any>(false, 400, errorMessage);
      }

      let searchQuery = {};
      if (search !== undefined) {
        searchQuery = {
          $or: [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { jobTitle: { $regex: search, $options: 'i' } },
            { designation: { $regex: search, $options: 'i' } },
            { 'addresses.city': { $regex: search, $options: 'i' } },
            { 'experiences.jobTitle': { $regex: search, $options: 'i' } },
          ],
        };
      }

      if (name !== undefined || email !== undefined || job !== undefined|| designation !== undefined || city !== undefined) {
        const andConditions = [];
    
        if (name !== undefined) {
          andConditions.push({$or: [
            { firstName: { $regex: name, $options: 'i' } },
            { lastName: { $regex: name, $options: 'i' } },
          ]});
        }
      
        if (email !== undefined) {
          andConditions.push({ email: { $regex: email, $options: 'i' } });
        }

        if (job !== undefined) {
          andConditions.push({ 'experiences.jobTitle': { $regex: job, $options: 'i' } });
        }

        if (designation !== undefined) {
          andConditions.push({ 'experiences.jobTitle': { $regex: designation, $options: 'i' } });
        }

        if (city !== undefined) {
          andConditions.push({ 'addresses.city': { $regex: city, $options: 'i' } });
        }
      
        searchQuery = { $and: andConditions };
      }

      let sortQuery = {};
      if (sort !== undefined) {
        const sortParams = sort.split(':');
        if (sortParams.length === 2) {
          const [column, order] = sortParams;
          sortQuery = { [column]: order === 'desc' ? -1 : 1 };
        }else{
          sortQuery = { createdAt:-1 };
        }
      }

      page = page === undefined ? 1 : parseInt(page);
      limit = limit === undefined ? 10 : parseInt(limit);
      const skip = (page - 1) * limit;
      const [records, totalCount] = await Promise.all([
        this.userModel.aggregate([
          {
            $match: {
              $and: [
                searchQuery,
                { deletedAt: null } // Filter out documents where deletedAt is not null
              ]
            }
          },
          ...(Object.keys(sortQuery).length > 0 ? [{ $sort: sortQuery }] : []),
          // {
          //   $skip: skip
          // },
          // {
          //   $limit: limit
          // },
          {
            $lookup: {
              from: 'applies',
              localField: '_id',
              foreignField: 'user',
              as: 'apply',
            },
          },
          // { $unwind: '$apply' },
          {
            $addFields: {
              fullName: { $concat: ["$firstName", " ", "$lastName"] },
              designation: { $arrayElemAt: ["$experiences.jobTitle", -1] }, 
            
              interviewSchedule:false,
              jobStatus: {
                $arrayElemAt:['$apply.status',0],
              },
              city: {
                $ifNull: [
                  { $arrayElemAt: ["$addresses.city", 0] }, // Corrected: Access the first element of the addresses array
                  ""
                ]
              },
             
              // experience: {
              //   $subtract: [
              //     {
              //       $toInt: {
              //         $cond: [
              //           { $and: [{ $ne: [{ $arrayElemAt: ["$experiences.toYear", 0] }, ""] }, { $ne: [{ $arrayElemAt: ["$experiences.toYear", 0] }, null] }] },
              //           { $arrayElemAt: ["$experiences.toYear", 0] },
              //           0
              //         ]
              //       }
              //     },
              //     {
              //       $toInt: {
              //         $cond: [
              //           { $and: [{ $ne: [{ $arrayElemAt: ["$experiences.fromYear", 0] }, ""] }, { $ne: [{ $arrayElemAt: ["$experiences.fromYear", 0] }, null] }] },
              //           { $arrayElemAt: ["$experiences.fromYear", 0] },
              //           0
              //         ]
              //       }
              //     }
              //   ]
              // }
              experience: {
                $sum: {
                  $map: {
                    input: "$experiences",
                    as: "experience",
                    in: {
                      $subtract: [
                        { $toInt: "$$experience.toYear" },
                        { $toInt: "$$experience.fromYear" }
                      ]
                    }
                  }
                }
              }
            }
          },
          {
            $project: {
              _id: 1,
              firstName: 1,
              lastName: 1,
              fullName: 1,
              email:1,
              phoneNo:1,
              curriculumVitae: 1,
              designation:1,
              city: 1,
              experience: 1,
              interviewSchedule:1,
              jobStatus: 1,
              createdAt:1
            }
          }
        ])
        .exec()
        ,
        this.userModel.countDocuments({ deletedAt: { $exists: false } }),
      ]);
      console.log(records, totalCount)
      if (records.length === 0) {
        return new Response<any>(true, 200, 'No records available', {});
      }

      const userIds = records.map((record:any) => record._id.toString());
      const totalAppliedCounts = await Promise.all(userIds.map((_id:string) => this.getTotalAppliedJobsByUser(_id)));
      records.forEach((record:any, index:number) => {
        record.totalApplied = totalAppliedCounts[index];
      });

      const appliedJobsByUser = await Promise.all(userIds.map((_id:string) => this.getAppliedJobsByUser(_id)));
      records.forEach((record:any, index:number) => {
        record.appliedFor = appliedJobsByUser[index];
      });

      const totalPages = Math.ceil(totalCount / limit);
      const currentPage = page;
      const output = {
        records: records,
        totalPages: totalPages !== null ? totalPages : 0,
        currentPage: currentPage !== null ? currentPage : 0,
        filterCount: records.length,
        totalCount: totalCount,
      };
      return new Response<any>(true, 200, 'Read operation successful', output);
    } catch (error: any) {
      return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
    }
  }

  async countApply(userId:string) {
    try {
      const result = await this.applyModel.countDocuments({ userId: new ObjectId(userId) });
      return result
    } catch (error: any) {
      return error.message;
    }
  }
  async  getAppliedJobsByUser(userId: string) {
    try {
      const appliedJobs = await Apply.find({ user: userId }).populate('job').exec();
      return appliedJobs;
    } catch (error: any) {
     return "Error"
    }
  }
  
  async  getTotalAppliedJobsByUser(userId: string) {
    try {
      const totalAppliedJobs = await Apply.countDocuments({ user: userId });
      return totalAppliedJobs;
    } catch (error: any) {
      return "Error"
    }
  }
  async searchUsers(query: any): Promise<Response<any>> {
    try {
      const searchOptions = {
        filters: `name:${query}*`, // Specify the filter to search in the "name" column with a partial match
        attributesToRetrieve: ['name'], // Specify the column(s) to retrieve in the search results
      };
      const result = await this.searchEngine.search('user', query, searchOptions);
      return new Response<any>(true, 200, 'Search engine operation successful', result);
    } catch (error: any) {
      return new Response<any>(false, 500, 'Search engine server error', undefined, undefined, error.message);
    }
  }

  async datatableOld(data: any): Promise<Response<any>> {
    try {
      let { page, limit, search, sort,token } = data;
      let errorMessage = '';

      if (page !== undefined && limit !== undefined) {
        if (isNaN(page) || !Number.isInteger(Number(page)) || isNaN(limit) || !Number.isInteger(Number(limit))) {
          errorMessage = "Both 'page' and 'limit' must be integers.";
        }
      } else if (page !== undefined) {
        if (isNaN(page) || !Number.isInteger(Number(page))) {
          errorMessage = "'page' must be an integer.";
        }
      } else if (limit !== undefined) {
        if (isNaN(limit) || !Number.isInteger(Number(limit))) {
          errorMessage = "'limit' must be an integer.";
        }
      }

      if (errorMessage) {
        return new Response<any>(false, 400, errorMessage);
      }

      let searchQuery = {};
      if (search !== undefined) {
        searchQuery = {
          $or: [
            { firstName: { $regex: search, $options: 'i' } },
            { lastName: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        };
      }
      let matchToken = token !== undefined
      ? [
          {
            $match: {
              'appliedFor.job.createdBy': token,
            },
          },
        ]
      : [];
      let sortQuery = {};
      if (sort !== undefined) {
        const sortParams = sort.split(':');
        if (sortParams.length === 2) {
          const [column, order] = sortParams;
          sortQuery = { [column]: order === 'desc' ? -1 : 1 };
        }else{
          sortQuery = { createdAt:-1 };
        }
      }

      page = page === undefined ? 1 : parseInt(page);
      limit = limit === undefined ? 10 : parseInt(limit);
      const skip = (page - 1) * limit;



      const [records, totalCount] = await Promise.all([
        this.userModel.aggregate([
        {
          $match: {
            $and: [
              searchQuery,
              { deletedAt: null } // Filter out documents where deletedAt is not null
            ]
          }
        },
        ...(Object.keys(sortQuery).length > 0 ? [{ $sort: sortQuery }] : []),
        {
          $skip: skip
        },
        {
          $limit: limit
        },
        {
          $lookup: {
            from: 'applies',
            localField: '_id',
            foreignField: 'user',
            as: 'appliedFor'
          }
        },
        {
          $unwind: '$appliedFor' 
        },
        {
          $lookup: {
            from: 'jobs',
            localField: 'appliedFor.job',
            foreignField: '_id',
            as: 'appliedFor.job'
          }
        },
        {
          $unwind: '$appliedFor.job'
        },
        {$addFields: {
          fullName: { $concat: ["$firstName", " ", "$lastName"] },
          designation: { $arrayElemAt: ["$experiences.jobTitle", -1] }, 
        
          interviewSchedule:false,
          jobStatus:{
            $arrayElemAt:['$apply.status',0],
          },
          city: {
            $ifNull: [
              { $arrayElemAt: ["$addresses.city", 0] }, // Corrected: Access the first element of the addresses array
              ""
            ]
          },
         
          experience: {
            $subtract: [
              {
                $toInt: {
                  $cond: [
                    { $and: [{ $ne: [{ $arrayElemAt: ["$experiences.toYear", 0] }, ""] }, { $ne: [{ $arrayElemAt: ["$experiences.toYear", 0] }, null] }] },
                    { $arrayElemAt: ["$experiences.toYear", 0] },
                    0
                  ]
                }
              },
              {
                $toInt: {
                  $cond: [
                    { $and: [{ $ne: [{ $arrayElemAt: ["$experiences.fromYear", 0] }, ""] }, { $ne: [{ $arrayElemAt: ["$experiences.fromYear", 0] }, null] }] },
                    { $arrayElemAt: ["$experiences.fromYear", 0] },
                    0
                  ]
                }
              }
            ]
          }
        }
      },

        {
          $project: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            fullName: 1,
            email:1,
            phoneNo:1,
            curriculumVitae: 1,
            designation:1,
            city: 1,
            experience: 1,
            interviewSchedule:1,
            jobStatus: 1,
            createdAt:1,
            appliedFor:1,
          }
        }
      ],...matchToken).exec(),
      this.userModel.countDocuments({ deletedAt: { $exists: false } }),
      ]);

      console.log(records, totalCount)
      if (records.length === 0) {
        return new Response<any>(true, 200, 'No records available', {});
      }

      const userIds = records.map((record:any) => record._id.toString());
      const totalAppliedCounts = await Promise.all(userIds.map((_id:string) => this.getTotalAppliedJobsByUser(_id)));
      records.forEach((record:any, index:number) => {
        record.totalApplied = totalAppliedCounts[index];
      });

      const appliedJobsByUser = await Promise.all(userIds.map((_id:string) => this.getAppliedJobsByUser(_id)));
      records.forEach((record:any, index:number) => {
        record.appliedFor = appliedJobsByUser[index];
      });

      const totalPages = Math.ceil(totalCount / limit);
      const currentPage = page;
      const output = {
        records: records,
        totalPages: totalPages !== null ? totalPages : 0,
        currentPage: currentPage !== null ? currentPage : 0,
        filterCount: records.length,
        totalCount: totalCount,
      };
      return new Response<any>(true, 200, 'Read operation successful', output);
    } catch (error: any) {
      return new Response<any>(false, 500, 'Search engine server error', undefined, undefined, error.message);
    }
  }

  async datatable(data: any): Promise<Response<any>> {
    try {
      let { page, limit, search, sort, token,name,email,title,status } = data;
   
        let errorMessage = '';
        if (page !== undefined && limit !== undefined) {
            if (isNaN(page) || !Number.isInteger(Number(page)) || isNaN(limit) || !Number.isInteger(Number(limit))) {
                errorMessage = "Both 'page' and 'limit' must be integers.";
            }
        } else if (page !== undefined) {
            if (isNaN(page) || !Number.isInteger(Number(page))) {
                errorMessage = "'page' must be an integer.";
            }
        } else if (limit !== undefined) {
            if (isNaN(limit) || !Number.isInteger(Number(limit))) {
                errorMessage = "'limit' must be an integer.";
            }
        }

        if (errorMessage) {
            return new Response<any>(false, 400, errorMessage);
        }

        let searchQuery = {};
        if (search !== undefined) {
            searchQuery = {
                $or: [
                    { 'userDetails.firstName': { $regex: search, $options: 'i' } },
                    { 'userDetails.lastName': { $regex: search, $options: 'i' } },
                    { title: { $regex: search, $options: 'i' } },
                ],
            };
        }

        if ( name !== undefined || title !== undefined || email !== undefined  || status !== undefined) {
          const andConditions = [];
        
          if (name !== undefined) {
           andConditions.push({$or: [
              { 'userDetails.firstName': { $regex: name, $options: 'i' } },
              { 'userDetails.lastName': { $regex: name, $options: 'i' } },
            ]})
          }
        
          if (title !== undefined) {
            andConditions.push({ title: { $regex: title, $options: 'i' } });
          }
          if (email !== undefined) {
            andConditions.push( { 'userDetails.email': { $regex: email, $options: 'i' } });
          }

          if (status !== undefined ) {
            console.log("status")
            console.log(status)
            if(status !== 'All' && status !== ''){
             andConditions.push( { 'appliedDetails.status': { $eq: status} }); 
            }
          }
          searchQuery = { $and: andConditions };
        }

        let sortQuery = {};
        if (sort !== undefined) {
            const sortParams = sort.split(':');
            if (sortParams.length === 2) {
                const [column, order] = sortParams;
                sortQuery = { [column]: order === 'desc' ? -1 : 1 };
            } else {
                sortQuery = { createdAt: -1 };
            }
        }

        page = page === undefined ? 1 : parseInt(page);
        limit = limit === undefined ? 10 : parseInt(limit);
        const skip = (page - 1) * limit;

        const records = await this.jobsModel.aggregate([
            {
                $match: { 'recruiter': new ObjectId(token) }
            },
            {
                $lookup: {
                    from: 'applies',
                    localField: '_id',
                    foreignField: 'job',
                    as: 'appliedDetails'
                }
            },
            {
                $unwind: '$appliedDetails'
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'appliedDetails.user',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $unwind: '$userDetails'
            },
            // {
            //     $lookup: {
            //         from: 'interviews',
            //         localField: 'appliedDetails.user',
            //         foreignField: 'user',
            //         as: 'interviewsDetails'
            //     }
            // },
            // {
            //   $unwind: '$interviewsDetails'
            // },
            {
                $match: searchQuery // Apply search query
            },
            // {
            //   ...(Object.keys(sortQuery).length > 0 ? [{ $sort: sortQuery }] : []),
            // },
            // {
            //     $skip: skip // Apply skip
            // },
            // {
            //     $limit: limit // Apply limit
            // },
            {
                $project: {
                    _id: 1,
                    jobId:'$appliedDetails.job',
                    title: 1,
                    reportToWork: 1,
                    reportAddress:1,
                    createdBy: 1,
                    candidateId: '$userDetails._id',
                    applyId: '$appliedDetails._id',
                    // interviewId: { $arrayElemAt: ["$interviewsDetails._id", 0] },
                    appliedDate: '$appliedDetails.createdAt',
                    appliedStatus: '$appliedDetails.status',
                    firstName: '$userDetails.firstName',
                    lastName: '$userDetails.lastName',
                    fullName: {
                      $concat: ['$userDetails.firstName', ' ', '$userDetails.lastName'] // Combine first name and last name
                    },
                    email:'$userDetails.email',
                    phoneNo:'$userDetails.phoneNo',
                    curriculumVitae: '$userDetails.curriculumVitae',
                    // designation:"Software Developer",
                    // city: "Shilling",
                    // experience: "10",
                    // userDetails: 1,
                  //   interviewsStatus: {
                  //     $cond: {
                  //         if: { $isArray: "$interviewsDetails" },
                  //         then: { $arrayElemAt: ["$interviewsDetails.status", 0] },
                  //         else: "false"
                  //     }
                  // },
                }
            }
        ]);
        // console.log("records");
        // console.log(records);
        // console.log("HERE");
        const outputResult = await Promise.all(records.map(async (record: any) => {
          const resultInterview = await this.interviewModel.findOne({ user: record.candidateId, job: record.jobId });
          if(resultInterview){
           return { ...record, interviewId: resultInterview._id, interviewsStatus: resultInterview.status }; 
          }else{
            return { ...record}
          }
          
      }));
        const totalCount =outputResult.length
        const totalPages = Math.ceil(totalCount / limit);
        const currentPage = page;
        const output = {
          records: outputResult,
          totalPages: totalPages !== null ? totalPages : 0,
          currentPage: currentPage !== null ? currentPage : 0,
          filterCount: outputResult.length,
          totalCount: totalCount,
        };
        
        // if (!records || records.length === 0) {
        //     return new Response<any>(true, 200, 'No jobs found for the specified job user', []);
        // }

        return new Response<any>(true, 200, 'Jobs and applied documents matching the specified job user', output);
    } catch (error: any) {
        return new Response<any>(false, 500, 'Internal Server Error111', undefined, undefined, error.message);
    }
}

async datatableResume(data: any): Promise<Response<any>> {
  try {
      let { page, limit, search, sort, token,name,title } = data;

      let errorMessage = '';
      if (page !== undefined && limit !== undefined) {
          if (isNaN(page) || !Number.isInteger(Number(page)) || isNaN(limit) || !Number.isInteger(Number(limit))) {
              errorMessage = "Both 'page' and 'limit' must be integers.";
          }
      } else if (page !== undefined) {
          if (isNaN(page) || !Number.isInteger(Number(page))) {
              errorMessage = "'page' must be an integer.";
          }
      } else if (limit !== undefined) {
          if (isNaN(limit) || !Number.isInteger(Number(limit))) {
              errorMessage = "'limit' must be an integer.";
          }
      }

      if (errorMessage) {
          return new Response<any>(false, 400, errorMessage);
      }

      let searchQuery = {};
      if (search !== undefined) {
          searchQuery = {
              $or: [
                  { 'userDetails.firstName': { $regex: search, $options: 'i' } },
                  { 'userDetails.lastName': { $regex: search, $options: 'i' } },
                  { title: { $regex: search, $options: 'i' } },
              ],
          };
      }
      if ( name !== undefined || title !== undefined) {
        const andConditions = [];
      
        if (name !== undefined) {
         andConditions.push({$or: [
            { 'userDetails.firstName': { $regex: name, $options: 'i' } },
            { 'userDetails.lastName': { $regex: name, $options: 'i' } },
          ]})
        }
      
        if (title !== undefined) {
          andConditions.push({ title: { $regex: title, $options: 'i' } });
        }
        searchQuery = { $and: andConditions };
      }

      let sortQuery = {};
      if (sort !== undefined) {
          const sortParams = sort.split(':');
          if (sortParams.length === 2) {
              const [column, order] = sortParams;
              sortQuery = { [column]: order === 'desc' ? -1 : 1 };
          } else {
              sortQuery = { createdAt: -1 };
          }
      }

      page = page === undefined ? 1 : parseInt(page);
      limit = limit === undefined ? 10 : parseInt(limit);
      const skip = (page - 1) * limit;

      const records = await this.jobsModel.aggregate([
          
          {
              $lookup: {
                  from: 'applies',
                  localField: '_id',
                  foreignField: 'job',
                  as: 'appliedDetails'
              }
          },
          {
              $unwind: '$appliedDetails'
          },
          {
              $lookup: {
                  from: 'users',
                  localField: 'appliedDetails.user',
                  foreignField: '_id',
                  as: 'userDetails'
              }
          },
          {
              $unwind: '$userDetails'
          },
          {
              $lookup: {
                  from: 'interviews',
                  localField: 'appliedDetails.user',
                  foreignField: 'user',
                  as: 'interviewsDetails'
              }
          },
          {
              $match: searchQuery // Apply search query
          },
          // {
          //   ...(Object.keys(sortQuery).length > 0 ? [{ $sort: sortQuery }] : []),
          // },
          // {
          //     $skip: skip // Apply skip
          // },
          // {
          //     $limit: limit // Apply limit
          // },
          {
              $project: {
                  _id: 1,
                  title: 1,
                  reportToWork: 1,
                  createdBy: 1,
                  appliedStatus: '$appliedDetails.status',
                  firstName: '$userDetails.firstName',
                  lastName: '$userDetails.lastName',
                  fullName: {
                    $concat: ['$userDetails.firstName', ' ', '$userDetails.lastName'] // Combine first name and last name
                  },
                  email:'$userDetails.email',
                  phoneNo:'$userDetails.phoneNo',
                  curriculumVitae: '$userDetails.curriculumVitae',
                  designation:"Software Developer",
                  city: "Shilling",
                  experience: "1",
                  // userDetails: 1,
                  interviewsStatus: {
                    $cond: {
                        if: { $isArray: "$interviewsDetails" },
                        then: { $arrayElemAt: ["$interviewsDetails.status", 0] },
                        else: "false"
                    }
                },
              }
          }
      ]);
      const totalCount =records.length
      const totalPages = Math.ceil(totalCount / limit);
      const currentPage = page;
      const output = {
        records: records,
        totalPages: totalPages !== null ? totalPages : 0,
        currentPage: currentPage !== null ? currentPage : 0,
        filterCount: records.length,
        totalCount: totalCount,
      };
      
      // if (!records || records.length === 0) {
      //     return new Response<any>(true, 200, 'No jobs found for the specified job user', []);
      // }

      return new Response<any>(true, 200, 'Jobs and applied documents matching the specified job user', output);
  } catch (error: any) {
      return new Response<any>(false, 500, 'Internal Server Error', undefined, undefined, error.message);
  }
}

}
