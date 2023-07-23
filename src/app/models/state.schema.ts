import mongoose,{ Schema, Document, model} from 'mongoose';
// import Country from '@models/country.schema';

export enum StateStatus {
  Active = "Active",
  Inactive = "In-Active",
}

export interface IStatus extends Document {
  stateName: string;
  stateCode: string;
  countryName:string;
  country:string;
  status: StateStatus;
  
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

const StateSchema: Schema = new Schema({
  stateName: {type:String},
  stateCode: {type:String},
  countryName:{type:String},
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country', // Referencing the User model
  },
  
  status:{type:String,enum:["Active","In-Active"],default:"Active"},

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

const State = model<IStatus>('State', StateSchema);

export default State;