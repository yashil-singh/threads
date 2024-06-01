import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log("Connected to Datbase Successfully.");
  } catch (error) {
    console.error(`Error Connecting to Database: ${error.message}`);
    process.exit(1);
  }
};
