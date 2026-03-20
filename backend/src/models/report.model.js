import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({

  interview: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Interview"
  },

  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  level: String,

  totalRawScore: Number,

  finalScore: Number,

  recommendation: String
});

const Report = mongoose.model("Report", reportSchema);

export default Report;