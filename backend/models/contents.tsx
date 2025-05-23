// models/Content.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IContent extends Document {
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContentSchema: Schema = new Schema({
  title: { type: String },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Content ||
  mongoose.model<IContent>("Content", ContentSchema);
