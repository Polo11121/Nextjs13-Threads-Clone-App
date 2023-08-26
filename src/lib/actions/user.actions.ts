"use server";

import { connectToDB } from "@/lib/mongoose";
import { revalidatePath } from "next/cache";
import { UserValidatorType } from "@/lib/validators/user";
import User, { UserSchema } from "@/lib/models/user.model";
import { FilterQuery, SortOrder } from "mongoose";
import Thread from "@/lib/models/thread.model";

interface UpdateUserParams extends UserValidatorType {
  userId: string;
  pathname: string;
}

interface FetchUsersParams {
  currentUserId: string;
  searchTerm: string;
  pageNumber: number;
  pageSize: number;
  sortBy: SortOrder;
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

export const fetchUsers = async ({
  currentUserId,
  searchTerm,
  pageNumber = 1,
  pageSize = 2,
  sortBy = "desc",
}: FetchUsersParams) => {
  try {
    connectToDB();

    const skipAmount = (pageNumber - 1) * pageSize;
    const regex = new RegExp(searchTerm, "i");

    const query: FilterQuery<UserSchema> = {
      id: {
        $ne: currentUserId,
      },
    };

    if (searchTerm.trim()) {
      query.$or = [
        {
          name: regex,
        },
        {
          username: regex,
        },
      ];
    }

    const sortOptions = {
      createdAt: sortBy,
    };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalUsers = await User.countDocuments(query);

    const users = await usersQuery.exec();
    const hasNext = totalUsers > pageSize * pageNumber;

    return {
      users,
      hasNext,
    };
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

export const fetchActivities = async (userId: string) => {
  try {
    connectToDB();

    const userThreads = await Thread.find({
      author: userId,
    });

    const childThreadIds = userThreads.map((thread) => thread.children).flat();

    const replies = await Thread.find({
      _id: {
        $in: childThreadIds,
      },
      author: {
        $ne: userId,
      },
    }).populate({
      path: "author",
      model: User,
      select: "name id image",
    });

    return replies;
  } catch (error) {
    throw new Error(`Failed to fetch activity: ${error}`);
  }
};
