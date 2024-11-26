import mongoose, { Schema, Document } from 'mongoose';

export interface BranchType extends Document {
  name: string;
  address: string;
  store_id: string;
  latitude: number;
  longitude: number;
  services?: string[];
  schedule?: Schedule[];
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

const branchSchema = new Schema<BranchType>({
  name: { type: String, required: true },
  address: { type: String, required: true },
  store_id: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  services: [String],
  schedule: [{ type: Object }],
});

const BranchModel = mongoose.model<BranchType>('Branch', branchSchema);

export default BranchModel;
