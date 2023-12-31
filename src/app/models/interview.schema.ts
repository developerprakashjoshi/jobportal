import mongoose,{ Schema, Document, model } from 'mongoose';


export interface IInterview extends Document {

  user:string;
  job:string;
  candidateName: string;
  interviewMode:string;
  interviewDate : Date;
  interviewTime: String;
  interviewLink :Date;
  interviewAddress: string;
  description :string;
  status:String;
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

const InterviewSchema: Schema = new Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  job:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Jobs',
  },
  user_id: {type:Number},
  candidateName: {type:String},
  interviewMode: {type:String},
  interviewDate : {type:Date},
  interviewTime: {type:String},
  interviewLink :{type:String},
  interviewAddress: {type:String},
  description :{type:String},
  status :{type:String},
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

const Interview = model<IInterview>('Interview', InterviewSchema);

export default Interview;