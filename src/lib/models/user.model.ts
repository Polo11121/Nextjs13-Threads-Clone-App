import mongoose, { Model } from "mongoose";
import { ThreadSchema } from "@/lib/models/thread.model";

export interface UserSchema {
  _id: string;
  id: string;
  username: string;
  name: string;
  image: string;
  bio: string;
  threads: ThreadSchema[];
  onboarded: boolean;
}

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: String,
  bio: String,
  threads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],
  onboarded: {
    type: Boolean,
    default: false,
  },
  communities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
    },
  ],
});

const User: Model<UserSchema> =
  mongoose.models.User || mongoose.model("User", userSchema);

export default User;
