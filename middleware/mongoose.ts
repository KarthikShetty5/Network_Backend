import mongoose from 'mongoose';
import dotenv from 'dotenv';  // ES Module import

dotenv.config();  // Load environment variables

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connection is successful");
  })
  .catch((error: any) => {
    console.log("Error in MongoDB connection", error);
  });

const connection = mongoose.connection;

connection.on("connected", () => {
  console.log("MongoDB connection is successful");
});

mongoose.connection.on("connected", () => {
  console.log("Mongoose connection established.");
});

mongoose.connection.on("error", (error: any) => {
  console.error("MongoDB error:", error);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB connection disconnected.");
});

// Retry connection on disconnect
mongoose.connection.on("reconnected", () => {
  console.log("MongoDB reconnected.");
});

connection.on("error", (error: any) => {
  console.log("Error in MongoDB connection", error);
});

export default connection;
