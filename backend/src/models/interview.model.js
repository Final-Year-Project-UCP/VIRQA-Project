import mongoose from "mongoose";
const interviewSchema = new mongoose.Schema({
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  mode:{type:String,enum:["voice"]},
  status: {
    type: String,
    enum: ["started","completed","ongoing"]
  },

  startTime: Date,
  endTime: Date
});