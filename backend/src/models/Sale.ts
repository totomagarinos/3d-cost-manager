import { model, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface ISale {
  _id: string;
  title: string;
  cost?: number;
  salePrice: number;
  clientName?: string;
  notes?: string;
  userId: string;
}

const saleSchema = new Schema<ISale>(
  {
    _id: { type: String, default: () => uuidv4() },
    title: { type: String, required: true },
    cost: { type: Number },
    salePrice: { type: Number, required: true },
    clientName: { type: String },
    notes: { type: String },
    userId: { type: String, required: true, index: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

export const Sale = model<ISale>("Sale", saleSchema);
