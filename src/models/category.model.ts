import mongoose, { Schema, Document } from 'mongoose';

interface Category extends Document {
  name: string;
  description: string;
  image?: string;
}

const CategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<Category>('Category', CategorySchema);
