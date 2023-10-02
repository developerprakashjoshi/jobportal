import { Schema, Document, model } from 'mongoose';

export enum SearchStatus {
  Active = 1,
  Inactive = 0,
}

export interface ISearch extends Document {
  name: string;
  description: string;
  status: SearchStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

const SearchSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: Number, enum: [0, 1], default: 1 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null },
});

const Search = model<ISearch>('Search', SearchSchema);

export default Search;
