
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