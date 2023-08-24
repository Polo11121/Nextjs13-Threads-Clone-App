import { UserSchema } from "@/lib/models/user.model";
import mongoose, { Model } from "mongoose";

export interface Thread {
  _id: string;
  id: string;
  text: string;
  author: UserSchema;
  community: string;
  createdAt: string;
  parentId: string;
}

export interface ThreadSchema extends Thread {
  children?: Thread[];
}

const threadSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  parentId: {
    type: String,
  },
  children: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],
});

const Thread: Model<ThreadSchema> =
  mongoose.models.Thread || mongoose.model("Thread", threadSchema);

export default Thread;
