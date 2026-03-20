import mongoose from "mongoose";
const answerSchema = new mongoose.Schema({
  interview: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Interview",
    required: true
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  question: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question"
  },
  answerText: String,
  aiScore: Number
});