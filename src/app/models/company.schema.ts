import { Schema, Document, model } from 'mongoose';



export interface ICompany extends Document {
  
  name:string,
  size:Number,
  industry:String,
  ceo:String,
  yearOfEstd:Number,
  revenue:Number,
  website:String,
  logo:String,
  ceoAvatar:String,
  description:String,
  location:String,
  photos: string[];

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

const CompanySchema: Schema = new Schema({
  
  name:{type:String},
  size:{type:Number},
  industry:{type:String},
  ceo:{type:String},
  yearOfEstd:{type:Number},
  revenue:{type:Number},
  website:{type:String},
  logo:{type:String},
  ceoAvatar:{type:String},
  description:{type:String},
  location:{type:String},
  photos: [{ type: String }], 
  
  createdAt: { type: Date },
  createdBy: { type: String },
  createdFrom: { type: String },

  updatedAt: { type: Date },
  updatedBy: { type: String },
  updateFrom: { type: String },

  deletedAt: { type: Date },
  deleteBy: { type: String },
  deleteFrom: { type: String },

});

const Company = model<ICompany>('Company', CompanySchema);

export default Company;