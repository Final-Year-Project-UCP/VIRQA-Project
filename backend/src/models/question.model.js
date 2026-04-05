import mongoose from "mongoose";
const questionSchema = new mongoose.Schema({
  text: String,
  category: String,
  difficulty: {
    type: String,
    enum: ["basic","intermediate","advanced"]
  },
  baseWeight: Number
});