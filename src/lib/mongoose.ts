import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) {
    return console.log("No MONGODB_URL env variable found!");
  }

  if (isConnected) {
    return console.log("Already connected to database!");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL);
    isConnected = true;

    console.log("Connected to database!");
  } catch (error) {
    throw new Error(`Failed to connect to database: ${error}`);
  }
};
