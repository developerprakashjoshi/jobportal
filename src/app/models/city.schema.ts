import mongoose,{ Schema, Document, model } from 'mongoose';


export interface ICity extends Document {
  cityName: string;
  cityCode: string;
  stateName: string;
  countryName: string;
  state:string;
  status: string;
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

const CitySchema: Schema = new Schema({
  cityName: { type: String},
  cityCode: { type: String},
  stateName: { type: String},
  countryName: { type: String},
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State', // Referencing the User model
  },
  status:{type:String},
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

const City = model<ICity>('City', CitySchema);

export default City;
