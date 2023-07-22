import mongoose,{ Schema, Document, model } from 'mongoose';

export enum ReportWork {
  specificAddress = 1,
  notSpecificAddress = 0,
}
export enum EducationLevel{
  Ten = 1,
  twelve =2,
  Diploma =3,
  Bachelor =4,
  Master = 5,
}
export enum IsStartPlanned{
  Yes = 1,
  No = 0,
} 
export enum JobStatus {
  Active = "Active",
  Inactive = "In-active",
}

export interface IJob extends Document {
  user:string,
  company:string,
  title:string,
  reportToWork:ReportWork,
  reportAddress:string,
  jobType:string,
  schedule:string,
  isStartPlanned:IsStartPlanned,
  startDate:Date,
  payRange:string,
  min:string,
  max:string,
  perMonth:string,
  supplementalPay:string,
  benefitsOffer:string,
  description:string,
  isCVRequired:Boolean,
  isDeadlineApplicable:Boolean,
  deadlineDate:Date,
  noOfHiring:Number,
  hiringSlot:String,
  aboutCompany:String,
  educationLevel:String,
  yearOfExperience:number,
  status:JobStatus,
  
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

const JobSchema: Schema = new Schema({
  user : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recruiter', // Referencing the User model
  },
  company:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
  },
  title:{type:String},
  reportToWork:{ type: Number, enum: [0, 1], default: 1 },
  reportAddress:{type:String},
  jobType:{type:String},
  schedule:{type:String},
  isStartPlanned:{type: Number, enum: [0, 1], default: 1},
  startDate:{type:Date},
  payRange:{type:String},
  min:{type:String},
  max:{type:String},
  perMonth:{type:String},
  supplementalPay:{type:String},
  benefitsOffer:{type:String},
  description:{type:String},
  isCVRequired:{type:Boolean},
  isDeadlineApplicable:{type:Boolean},
  deadlineDate:{type:Date},
  noOfHiring:{type:Number},
  hiringSlot:{type:String},
  aboutCompany:{type:String},
  educationLevel:{type: Number, enum: [1,2,3,4], default:4 },
  yearOfExperience:{type:Number},
  status:{type:String,enum:["Active","in-Active"],default:"Active"},

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

const Jobs = model<IJob>('Jobs', JobSchema);

export default Jobs;