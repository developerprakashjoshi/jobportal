import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMessage extends Document {
  chatId: string;
  senderId: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema<IMessage> = new Schema(
  {
    chatId: {
      type: String,
      required: true,
    },
    senderId: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const MessagesModel: Model<IMessage> = mongoose.model<IMessage>("Messages", MessageSchema);

export default MessagesModel;
