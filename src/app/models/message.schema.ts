import mongoose,{ Schema, Document, model } from 'mongoose';



export interface IMessage extends Document {
  sender:string,
  recipient:string,
  message: string;
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

const MessageSchema: Schema = new Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Referencing the User model
  },
  recipient:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  
  message: { type: String },
  

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

const Message = model<IMessage>('Message', MessageSchema);

export default Message;