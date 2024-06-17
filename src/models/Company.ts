import { Schema, model } from 'mongoose';

const companySchema = new Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Company = model('Company', companySchema);