import { Schema, Document, model } from 'mongoose';


export interface IReview extends Document {
  
  name:string,
  designation:string,
  rating:string,
  message:string,

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

const ReviewSchema: Schema = new Schema({
  
  name:{type:String},
  designation:{type:String},
  rating:{type:String},
  message:{type:String},

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

const Review = model<IReview>('Review', ReviewSchema);

export default Review;