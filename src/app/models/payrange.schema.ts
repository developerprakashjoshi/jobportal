import { Schema, Document, model } from 'mongoose';

export interface IPayRange extends Document {
  range:string,
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

const PayRangeSchema: Schema = new Schema({
  range:{type:String},
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

const PayRange = model<IPayRange>('PayRange', PayRangeSchema);

export default PayRange;
