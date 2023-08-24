"use server";

import { connectToDB } from "@/lib/mongoose";
import { revalidatePath } from "next/cache";
import { UserValidatorType } from "@/lib/validators/user";
import User from "@/lib/models/user.model";
import Thread from "@/lib/models/thread.model";

interface UpdateUserParams extends UserValidatorType {
  userId: string;
  pathname: string;
}

export const fetchUser = async (userId: string) => {
  try {
    connectToDB();

    return await User.findOne({
      id: userId,
    });
    // .populate({
    //   path: "comunities",
    // });
  } catch (error) {
    throw new Error(`Failed to fetch user: ${error}`);
  }
};

export const updateUser = async ({
  userId,
  username,
  name,
  bio,
  profile_photo,
  pathname,
}: UpdateUserParams) => {
  try {
    connectToDB();

    await User.findOneAndUpdate(
      {
        id: userId,
      },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image: profile_photo,
        onboarded: true,
      },
      {
        upsert: true,
      }
    );

    if (pathname === "/profile/edit") {
      revalidatePath(pathname);
    }
  } catch (error) {
    throw new Error(`Failed to create/update user: ${error}`);
  }
};

export const fetchUserThreads = async (userId: string) => {
  try {
    connectToDB();

    const threads = await User.findOne({
      id: userId,
    }).populate({
      path: "threads",
      model: Thread,
      populate: {
        path: "children",
        model: Thread,
        populate: {
          path: "author",
          model: User,
          select: "name id image",
        },
      },
    });

    return threads;
  } catch (error) {
    throw new Error(`Failed to fetch user threads: ${error}`);
  }
};
