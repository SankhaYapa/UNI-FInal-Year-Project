import multer from "multer";
import User from "../models/user.model.js";
import RecommendationDetails from "../models/recomendedDetails.model.js";
import createError from "../utils/createError.js";
import { spawn } from "child_process";

// Configure multer to save files to a specific folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./content/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

export const uploadCv = (req, res) => {
  // Handle the file upload using the 'upload' middleware
  upload.single("cvFile")(req, res, async (err) => {
    if (err) {
      // Handle any upload errors here
      console.error("Error uploading CV:", err);
      return res.status(500).json({ message: "File upload failed" });
    }

    // File has been successfully uploaded, you can save its details in the database if needed
    const { filename, path } = req.file;
    console.log(`CV file uploaded: ${filename}, saved to ${path}`);

    // Assuming you have a user ID available in the request, e.g., req.query.userId
    const userId = req.query.userId;
    console.log(userId);

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      // Update the user's record with the CV file path
      await User.findByIdAndUpdate(userId, { skillPdf: path });

      console.log(`CV file uploaded: ${filename}, saved to ${path}`);

      // Invoke the Python script with the uploaded file path as an argument
      const pythonProcess = spawn('python', ['./futurepath_module.py', path]);

      let pythonResponse = "";

      // Capture the output of the Python script
      pythonProcess.stdout.on("data", (data) => {
        pythonResponse += data.toString(); // Convert the buffer to a string
        // console.log("Python Script Output:", pythonResponse);
    
      });

      // Handle any errors from the Python script
      pythonProcess.stderr.on("data", (data) => {
        console.error("Python Script Error:", data.toString());
        // return next(createError(500, "Internal server error"));
      });
      pythonProcess.on("close", async (code) => {
        if (code === 0) {
          try {
            // Parse the JSON response from the Python script
            const recommendations = JSON.parse(pythonResponse);

            // Remove old recommendations and update with new recommendations
            await RecommendationDetails.findOneAndRemove({ userId });
            // Create an array of course documents to store in the database
            const courseDocuments = recommendations.courses.map((course) => ({
              name: course['Course Name'],
              university: course['University'],
              difficultyLevel: course['Difficulty Level'],
              courseRating: parseFloat(course['Course Rating']), // Convert to a float
              courseURL: course['Course URL'],
              courseDescription: course['Course Description'],
              skills: course['Skills'].split(/\s+/), // Split the skills string into an array
            }));

            // Store new course recommendations in the database
            await RecommendationDetails.create({
              userId: userId,
              courses: courseDocuments,
              careerPath: recommendations.career_path,
            });

            // Respond to the client with the Python script's output
            res.status(200).json({ message: "CV uploaded successfully", recommendations });
          } catch (error) {
            console.error("Error parsing Python script output or updating user:", error);
            return next(createError(500, "Internal server error"));
          }
        } else {
          console.error(`Python script exited with code ${code}`);
          return next(createError(500, "Internal server error"));
        }
      });
      
    } catch (error) {
      console.error("Error updating user with CV file path:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
};


export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (req.userId !== user._id.toString()) {
      return next(createError(403, "You can delete only your account!"));
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).send("User deleted.");
  } catch (error) {
    console.error("Error deleting user:", error);
    next(createError(500, "Internal server error"));
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(createError(404, "User not found"));
    }

    res.status(200).send(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    next(createError(500, "Internal server error"));
  }
};
