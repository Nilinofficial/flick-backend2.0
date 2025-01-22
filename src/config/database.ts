import mongoose from 'mongoose';

export const connectToDB = async () => {
  try {
    mongoose.connect(`${process.env.MONGO_URI}`);
  } catch (err: unknown) {
    console.log('error connecting to database', err);
  }
};
