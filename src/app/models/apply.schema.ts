import mongoose,{ Schema, Document, model } from 'mongoose';



export interface IApply extends Document {
  
  job:string;
  user:string;
  applyAt: Date;
  status:string;
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

const ApplySchema: Schema = new Schema({
  
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Jobs', // Referencing the User model
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  applyAt: { type: Date },
  status: { type: String },
  created_at: { type: String},
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

const Apply = model<IApply>('Apply', ApplySchema);

export default Apply;
