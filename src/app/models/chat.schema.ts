import mongoose, { Schema, Document, Model } from "mongoose";

export interface IChat extends Document {
  members: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema: Schema<IChat> = new Schema(
  {
    members: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ChatModel: Model<IChat> = mongoose.model<IChat>("Chat", ChatSchema);

export default ChatModel;