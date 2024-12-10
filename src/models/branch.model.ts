import mongoose, { Schema, Document } from 'mongoose';

// Define interfaces for TypeScript type-checking
export interface BranchType extends Document {
  name: string;
  category_id: string;
  address: string;
  store_id: string;
  latitude: number;
  longitude: number;
  services?: string[];
  schedule?: Schedule;
}

export interface Schedule {
  monday?: Hours;
  tuesday?: Hours;
  wednesday?: Hours;
  thursday?: Hours;
  friday?: Hours;
  saturday?: Hours;
  sunday?: Hours;
}

export interface Hours {
  open: string;
  close: string;
}

// Schema definition
const branchSchema = new Schema<BranchType>({
  name: { type: String, required: true },
  category_id: { type: String, required: true },
  address: { type: String, required: true },
  store_id: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  services: {
    type: [String], // Defines an array of strings for services
    default: [],
  },
  schedule: {
    type: Map, // Use a Map to represent the schedule days dynamically
    of: {
      open: { type: String, required: true },
      close: { type: String, required: true },
    },
    default: {},
  },
});

// Create model
const BranchModel = mongoose.model<BranchType>('Branch', branchSchema);

export default BranchModel;
