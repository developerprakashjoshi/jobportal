import { Schema, Document, model } from 'mongoose';

export enum RoleStatus {
  Active = 1,
  Inactive = 0,
}

export interface IRole extends Document {
  name: string;
  description: string;
  status: RoleStatus;
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

const RoleSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: Number, enum: [0, 1], default: 1 },
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

const Role = model<IRole>('Role', RoleSchema);

export default Role;
