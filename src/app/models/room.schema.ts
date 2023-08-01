import mongoose, { Document, Model, Schema } from 'mongoose';
import { IAccount } from '@models/account.schema';
import { ITweet } from '@models/tweet.schema'; // Import the Tweet interface

export interface IRoom extends Document {
  name: string;
  participants: IAccount['_id'][];
  participantsName: string[];
  createdBy: IAccount['_id'];
  messages: ITweet['_id'][]; // Add the messages property
}

const roomSchema: Schema = new mongoose.Schema({
  name: { type: String, required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }], // Add the messages property here
  participantsName: [String],
});

const Room: Model<IRoom> = mongoose.model<IRoom>('Room', roomSchema);

export default Room;



// import mongoose, { Document, Model, Schema } from 'mongoose';
// import { IAccount } from '@models/account.schema';
// import { ITweet } from '@models/tweet.schema';
// export interface IRoom extends Document {
//   name: string;
//   participants: IAccount['_id'][];
//   createdBy: IAccount['_id'];
//   messages: ITweet['_id'][];
//   addMessage: (message: ITweet) => Promise<void>;
// }

// // export interface ITweet {
// //   content: string;
// //   sender: IAccount['_id'];
// //   room: IRoom['_id'];
// //   timestamp?: Date;
// // }

// const roomSchema: Schema = new mongoose.Schema({
//   name: { type: String, required: true },
//   participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tweet' }], 
// });

// roomSchema.methods.addMessage = async function (message: ITweet) {
//   this.messages.push(message);
//   await this.save();
// };

// const Room: Model<IRoom> = mongoose.model<IRoom>('Room', roomSchema);

// export default Room;
