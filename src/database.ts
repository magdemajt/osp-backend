import mongoose from 'mongoose';


export default async function connectToMongo() {
  try {
    await mongoose.connect(process.env.MONGO_URL as string);
    console.log('MongoDB connected');
  } catch (error) {
    console.log('MongoDB connection error: ', (error as Error).message);
    process.exit(1);
  }
}
