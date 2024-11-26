import mongoose, { Schema, Document } from 'mongoose';

interface Product extends Document {
  name: string;
  store_id: string;
  description: string;
  price: number;
  image?: string;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    store_id: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<Product>('Product', ProductSchema);
