import { Schema, Document, model } from 'mongoose';


export interface IInterview extends Document {

  candidateName: string;
  interviewDate : Date;
  interviewTime: Date;
  interviewLink :Date;
  description :string;
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
  user_id: {type:Number},
  candidateName: {type:String},
  interviewDate : {type:Date},
  interviewTime: {type:Date},
  interviewLink :{type:String},
  description :{type:String},

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