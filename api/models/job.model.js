import mongoose from "mongoose";

const { Schema } = mongoose;

const jobSchema = new Schema({
  userId: { type: String, required: true },
  desc: { type: String, required: true },
  days: { type: Number, required: true },
  budget: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  offers: [
   {
    userId: { type: String, required: false },
    price: { type: Number, required: false },
   
   }
  ],
  recommendedCareerPath: { type: String, required: false },
});

const Job = mongoose.model("Job", jobSchema);

export default Job;
