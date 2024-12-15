import mongoose, { Document, Schema, model } from "mongoose";

// Define the TypeScript interface for the Message
export interface IMessage extends Document {
  sender: string; // userId of the sender
  receiver: string; // userId of the receiver
  content: string;
  timestamp: Date;
}

// Define the Mongoose schema for the Message
const MessageSchema: Schema = new mongoose.Schema({
  sender: { type: String, required: true }, // userId of the sender
  receiver: { type: String, required: true }, // userId of the receiver
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

// Create and export the Mongoose model with the IMessage interface
const Message = model<IMessage>("Message", MessageSchema);

export default Message;
