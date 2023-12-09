import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, require: true, unique: true },
    role: { type: String, default: "USER" },
    avatar: { type: String, default: "" },
    fullName: { type: String, require: true },
    phoneNumber: { type: String, default: "" },
    lastLogin: { type: Date },
    bio: { type: String, unique: true },
    isActive: { type: Boolean, default: true },
    isOnline: { type: Boolean, default: false },
    tags: [{ type: String }]
  },
  {
    timestamps: true,
    methods: {
      sayHello() {
        console.log(`Hello I am ${this.username}!`)
      },
    },
  },
);

export type User = mongoose.InferSchemaType<typeof UserSchema>
export const User = mongoose.model('User', UserSchema)