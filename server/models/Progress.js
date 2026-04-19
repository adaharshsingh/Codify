import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  problemId: { type: String, required: true },  // subdoc _id as string
  solved:    { type: Boolean, default: false },
  starred:   { type: Boolean, default: false },
  note:      { type: String, default: '' },
}, { timestamps: true });

// Compound unique index — one entry per user per problem
progressSchema.index({ userId: 1, problemId: 1 }, { unique: true });

export default mongoose.model('Progress', progressSchema);
