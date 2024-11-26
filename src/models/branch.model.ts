import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for Branch (used for type-checking)
export interface BranchType extends Document {
  name: string;
  address: string;
  store_id: string;
  latitude: number;
  longitude: number;
  services?: string[];
  schedule?: Schedule[];
}

// Define Schedule and Hours interfaces
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

// Define the Mongoose schema for Branch
const branchSchema = new Schema<BranchType>({
  name: { type: String, required: true },
  address: { type: String, required: true },
  store_id: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  services: [String],
  schedule: [{ type: Object }],
});

// Create and export the Mongoose model
const BranchModel = mongoose.model<BranchType>('Branch', branchSchema);

export default BranchModel;  // Only export the model, not the interface
