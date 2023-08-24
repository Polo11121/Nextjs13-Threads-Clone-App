"use server";

import { revalidatePath } from "next/cache";
import { connectToDB } from "@/lib/mongoose";
import { ThreadValidatorType } from "@/lib/validators/thread";
import Thread from "@/lib/models/thread.model";
import User from "@/lib/models/user.model";

interface CreateUserParams extends ThreadValidatorType {
  communityId: string;
  pathname: string;
}

interface AddCommentParams {
  parentId: string;
  author: string;
  pathname: string;
  text: string;
}

export const fetchThread = async (threadId: string) => {
  try {
    connectToDB();

    const thread = await Thread.findOne({
      id: threadId,
    })
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      })
      .exec();

    return thread;
  } catch (error) {
    throw new Error(`Failed to fetch thread: ${error}`);
  }
};

export const fetchThreads = async (pageNumber = 1, pageSize = 20) => {
  try {
    connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    const threadsQuery = Thread.find({
      parentId: {
        $in: [null, undefined],
      },
    })
      .skip(skipAmount)
      .limit(pageSize)
      .sort({
        createdAt: "desc",
      })
      .populate({
        path: "author",
        model: User,
      })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: User,
          select: "_id name parentId image",
        },
      });

    const totalThreads = await Thread.countDocuments({
      parentId: {
        $in: [null, undefined],
      },
    });

    const threads = await threadsQuery.exec();

    const hasNext = totalThreads > skipAmount * threads.length;

    return {
      threads,
      hasNext,
    };
  } catch (error) {
    throw new Error(`Failed to fetch threads: ${error}`);
  }
};

export const createThread = async ({
  text,
  author,
  communityId,
  pathname,
}: CreateUserParams) => {
  try {
    connectToDB();

    const createdThread = await Thread.create({
      author,
      text,
      community: null,
    });

    await User.findByIdAndUpdate(author, {
      $push: {
        threads: createdThread._id,
      },
    });

    revalidatePath(pathname);
  } catch (error) {
    throw new Error(`Failed to create thread: ${error}`);
  }
};

export const addComment = async ({
  parentId,
  text,
  author,
  pathname,
}: AddCommentParams) => {
  try {
    connectToDB();

    const originalThread = await Thread.findById(parentId);

    if (!originalThread) {
      throw new Error("Thread not found");
    }

    const commentThread = new Thread({
      text,
      author,
      parentId,
    });

    const savedCommentThread = await commentThread.save();

    // @ts-ignore
    originalThread.children.push(savedCommentThread._id);

    await originalThread.save();

    revalidatePath(pathname);
  } catch (error) {
    throw new Error(`Failed to add comment: ${error}`);
  }
};
