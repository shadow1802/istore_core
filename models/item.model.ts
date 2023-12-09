import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    images: [{
        type: String, default: []
    }],
    categories: [{ type: String, default: [] }],
    notes: [{ type: String, default: [] }],
    mode: { type: String },
    price: { type: String },
    brand: { type: String },
    count: { type: String, default: 0 },
    createdBy: { type: mongoose.Types.ObjectId, ref: "User", require: true },
    tags: [{ type: String, default: [] }]
  },
  {
    timestamps: true
  },
);

export type ItemDetail = mongoose.InferSchemaType<typeof ItemSchema>
export const Item = mongoose.model('Item', ItemSchema)