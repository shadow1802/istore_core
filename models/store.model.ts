import mongoose from 'mongoose';

const StoreSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    banner: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Types.ObjectId, ref: "User" },
    tags: [{ type: String, default: [] }]
  },
  {
    timestamps: true
  },
);

export type Store = mongoose.InferSchemaType<typeof StoreSchema>
export const Store = mongoose.model('Store', StoreSchema)