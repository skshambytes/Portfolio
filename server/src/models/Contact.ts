import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  ipHash: string;
  createdAt: Date;
}

const ContactSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 255,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },
    ipHash: {
      type: String,
      required: true,
      index: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      // 90 days TTL index: 90 * 24 * 60 * 60 = 7776000 seconds
      expires: 7776000,
    },
  },
  {
    versionKey: false,
  }
);

export const Contact = mongoose.model<IContact>('Contact', ContactSchema);
