import mongoose, { Schema, Document } from 'mongoose';

interface Store extends Document {
  name: string;
  description: string;
  category_id: string;
  main_address: string;
  main_phone: string;
  website?: string;
  image?: string;
}

const StoreSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category_id: { type: String, required: true },
    main_address: { type: String, required: true },
    main_phone: { type: String, required: true },
    website: { type: String },
    image: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<Store>('Store', StoreSchema);
