import mongoose,{ Schema, Document, model } from 'mongoose';

export interface IFavourite extends Document {
  user:string,
  job:string,
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

const FavouriteSchema: Schema = new Schema({

  user : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Referencing the User model
  },
  job : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Jobs', // Referencing the Jobs model
  },

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

const Favourite = model<IFavourite>('Favourite', FavouriteSchema);

export default Favourite;
