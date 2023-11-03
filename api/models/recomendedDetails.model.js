import mongoose from "mongoose";

const { Schema } = mongoose;

const RecommendationDetailsSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model (assuming you have a User model)
      required: true,
    },
    courses: [
      {
        name: {
          type: String,
          required: false,
        },
        university: {
          type: String,
          required: false,
        },
        difficultyLevel: {
          type: String,
          required: false,
        },
        courseRating: {
          type: Number,
          required: false,
        },
        courseURL: {
          type: String,
          required: false,
        },
        courseDescription: {
          type: String,
          required: false,
        },
      },
    ],
    careerPath: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("RecommendationDetails", RecommendationDetailsSchema);
