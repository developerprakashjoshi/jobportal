import mongoose,{ Schema, Document, model } from 'mongoose';


export enum IsHire {
  Active = 1,
  Inactive = 0,
}
export enum recruiterStatus {
  Active = 1,
  Inactive = 0,
}

export interface IRecruiter extends Document {
  
  firstName:string,
  LastName:string,
  email:string,
  company:string,
  job:string,
  password:string,
  phoneNumber:number,
  companyName:string,
  employeeSize:number,
  selectIndustry:string,
  yourDesignation:string,
  termConditions :boolean,
  companyLocation:string,
  isHiringManager:IsHire,
  status:recruiterStatus,
  
  createdAt: Date;
  createdBy: Number;
  createdFrom?: String;

  updatedAt: Date;
  updatedBy: String;
  updateFrom?: String;

  deletedAt: Date;
  deleteBy: String;
  deleteFrom?: String;
}

const RecruiterSchema: Schema = new Schema({
  
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company', // Referencing the User model
  },
  
  firstName:{type:String},
  LastName:{type:String},
  email:{type:String},
  password:{type:String},
  phoneNumber:{type:Number},
  companyName:{type:String},
  employeeSize:{type:Number},
  selectIndustry:{type:String},
  yourDesignation:{type:String},
  termConditions :{type:Boolean},
  companyLocation :{type:String},
  isHiringManager:{type:Number,enum:[0,1],default:0},
  status:{type:Number,enum:[0,1],default:0},
  

  createdAt: { type: Date},
  createdBy: { type: String},
  createdFrom: { type: String },

  updatedAt: { type: Date },
  updatedBy: { type: String},
  updateFrom: { type: String },

  deletedAt: { type: Date },
  deleteBy: { type: Number},
  deleteFrom: { type: String },
  
});

const Recruiter = model<IRecruiter>('Recruiter', RecruiterSchema);

export default Recruiter;