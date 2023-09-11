// import Course from "../models/course.model.js";


// export const getCourse = async (req, res) => {
//   try {
//     const courses = await Course.find({});
//     res.status(200).json(courses);
//   } catch (err) {
//     res.status(500).json(error);
//   }
// };
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