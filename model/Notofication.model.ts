import mongoose, { Document, Schema, model } from "mongoose";

// Define the TypeScript interface for Notification
export interface INotification extends Document {
  userId: string;      // ID of the user receiving the notification
  connectId: string;   // ID related to the connection or trigger of the notification
  message: string;     // Notification message
  viewed: boolean;     // Whether the notification has been viewed
  timestamp: Date;     // Timestamp of the notification
}

// Define the Mongoose schema for Notification
const NotificationSchema: Schema = new mongoose.Schema({
  userId: { type: String, required: true },
  connectId: { type: String, required: true },
  message: { type: String, required: true },
  viewed: { type: Boolean, required: true },
  timestamp: { type: Date, default: Date.now },
});

// Create and export the Mongoose model with the INotification interface
const Notification = model<INotification>("Notification", NotificationSchema);

export default Notification;
