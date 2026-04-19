import mongoose from 'mongoose';

const sheetSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:        { type: String, required: true },
  description: { type: String, default: '' },
  emoji:       { type: String, default: '📝' },
}, { timestamps: true });

export default mongoose.model('Sheet', sheetSchema);
