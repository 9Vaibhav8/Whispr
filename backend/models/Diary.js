import mongoose from 'mongoose';

const diarySchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  mood: { type: String },  // Happy, Sad, etc.
  date: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  images: [{
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  }]

  
  
}, { timestamps: true });

const Diary = mongoose.model('Diary', diarySchema);
export default Diary;
