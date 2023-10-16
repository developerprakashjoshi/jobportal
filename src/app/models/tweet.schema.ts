import mongoose, { Document, Model, Schema } from 'mongoose';
import { IRoom } from '@models/room.schema';
import { IAccount } from '@models/account.schema';

export interface ITweet extends Document {
  content: string;
  sender: IAccount['_id'];
  room: IRoom['_id'];
  timestamp?: Date;
  read: boolean;
}

const messageSchema: Schema = new mongoose.Schema({
  content: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

const Tweet: Model<ITweet> = mongoose.model<ITweet>('Tweet', messageSchema);

export default Tweet;
