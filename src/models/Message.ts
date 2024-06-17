import { Schema, model } from 'mongoose';

const messageSchema = new Schema({
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Message = model('Message', messageSchema);
