
import recomendedDetailsModel from "../models/recomendedDetails.model.js";


export const getCourse = async (req, res) => {
    try {
      const userId = req.params.userId; // Extract the userId from route parameters
      const courses = await recomendedDetailsModel.find({ userId });
      console.log("Reco",userId);
      res.status(200).json(courses);
    } catch (err) {
      res.status(500).json(err);
    }
  };
  
  export const getUserCreerPath= async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await recomendedDetailsModel.findOne({ userId });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ careerPath: user.careerPath });
    } catch (error) {
      console.error("Error getting user career path:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
// //create a course

// export const postCourse = async (req, res) => {
//   const newCourse= new Course(req.body);
//   try {
//     const savedCourse = await newCourse.save();
//     res.status(200).json(savedCourse);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// };