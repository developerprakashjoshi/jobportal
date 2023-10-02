import mongoose,{ Schema, Document, model } from 'mongoose';

export enum SearchStatus {
  Active = 1,
  Inactive = 0,
}

export interface ISearch extends Document {
  userId:string;
  email:string;
  keywords: string;
  status: SearchStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

const SearchSchema: Schema = new Schema({
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  email: { type: String, required: true },
  keywords: { type: String, required: true },
  status: { type: Number, enum: [0, 1], default: 1 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null },
});

const Search = model<ISearch>('Search', SearchSchema);

export default Search;
