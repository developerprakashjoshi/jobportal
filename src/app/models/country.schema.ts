import { Schema, Document, model } from 'mongoose';

export enum CountryStatus {
  Active = "Active",
  Inactive = "In-Active",
}

export interface ICountry extends Document {
  countryName: string;
  countryCode: string;
  status: CountryStatus;
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

const CountrySchema: Schema = new Schema({
  countryName: { type: String },
  countryCode: { type: String },
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

const Country = model<ICountry>('Country', CountrySchema);

export default Country;