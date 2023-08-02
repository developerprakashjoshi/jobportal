import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IAccount extends Document {
  username: string;
  email: string;
  type:string;
  // job:string;
}

const userSchema: Schema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  type: { type: String, required: true },
  // job: { type: String, required: true}
});

const Account: Model<IAccount> = mongoose.model<IAccount>('Account', userSchema);

export default Account;

