import { Schema, Document, model } from 'mongoose';


export enum IsHire {
  Active = 1,
  Inactive = 0,
}

export interface IRecruiter extends Document {
  
  firstName:string,
  LastName:string,
  email:string,
  password:string,
  confirmPassword:string,
  phoneNumber:number,
  companyName:string,
  employeeSize:number,
  selectIndustry:string,
  yourDesignation:string,
  isHiringManager:IsHire,
  
  createdAt: Date;
  createdBy: String;
  createdFrom?: String;

  updatedAt: Date;
  updatedBy: String;
  updateFrom?: String;

  deletedAt: Date;
  deleteBy: String;
  deleteFrom?: String;
}

const RecruiterSchema: Schema = new Schema({
  
  firstName:{type:String},
  LastName:{type:String},
  email:{type:String},
  password:{type:String},
  confirmPassword:{type:String},
  phoneNumber:{type:Number},
  companyName:{type:String},
  employeeSize:{type:Number},
  selectIndustry:{type:String},
  yourDesignation:{type:String},
  isHiringManager:{type:Number,enum:[0,1],default:0},
  

  createdAt: { type: Date},
  createdBy: { type: String},
  createdFrom: { type: String },

  updatedAt: { type: Date },
  updatedBy: { type: String},
  updateFrom: { type: String },

  deletedAt: { type: Date },
  deleteBy: { type: String},
  deleteFrom: { type: String },
  
});

const Recruiter = model<IRecruiter>('Recruiter', RecruiterSchema);

export default Recruiter;