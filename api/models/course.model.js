import mongoose from "mongoose";
const { Schema } = mongoose;

const CourseSchema = new Schema(
  { 
    image: {
      type: String,
      required: true,
    },
    cImage: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    cname: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Course", CourseSchema);
