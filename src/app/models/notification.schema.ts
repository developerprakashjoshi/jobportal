import mongoose,{ Schema, Document, model } from 'mongoose';



export interface INotification extends Document {
  type:string,
  content: string,
  sender:string,
  recipient:string,
  commonUser:string,
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

const NotificationSchema: Schema = new Schema({

  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Referencing the User model
  },
  recipient:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  content: { type: String },
  type: { type: String },
  commonUser: { type: String },
  created_at: { type: Date},
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

const Notification = model<INotification>('Notification', NotificationSchema);

export default Notification ;