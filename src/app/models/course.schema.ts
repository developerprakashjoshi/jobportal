import { Schema, Document, model } from 'mongoose';

export enum CourseStatus {
  Active = 1,
  Inactive = 0,
}

export interface ICourse extends Document {
  
  alphaLearnCourse: Boolean,
  availableFrom: Date,
  availableTill :Date,
  avgRating:Number,
  courseCode:String,
  courseId:Number,
  courseType:String,
  currency:String,
  description:String,
  price:String,
  status: String,
  thumbnail:String


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

const CourseSchema: Schema = new Schema({
  alphaLearnCourse: { type: Boolean, required: true },
  availableFrom: { type:Date, required: true },
  availableTill :{type:Date,required:true},
  avgRating:{type:Number,required:true},
  courseCode:{ type: String, required: true },
  courseId:{ type: Number, required: true },
  courseType:{ type: String, required: true },
  currency:{ type: String, required: true },
  description:{ type: String, required: true },
  price:{ type: String, required: true },
  status: { type: String },
  thumbnail:{type:String},
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

const Course = model<ICourse>('Course', CourseSchema);

export default Course;
