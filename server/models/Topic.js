import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  difficulty:  { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  platform:    { type: String, default: '' },
  url:         { type: String, default: '' },
  tags:        [String],
  statement:   { type: String, default: '' },
  constraints: { type: String, default: '' },
  examples:    [{ input: String, output: String, explanation: String }],
}, { timestamps: true });

const topicSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:    { type: String, required: true },
  icon:     { type: String, default: '📝' },
  color:    { type: String, default: 'navy' },
  problems: [problemSchema],
}, { timestamps: true });

export default mongoose.model('Topic', topicSchema);
