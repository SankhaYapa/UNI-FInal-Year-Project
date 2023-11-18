import multer from "multer";
import User from "../models/user.model.js";
import RecommendationDetails from "../models/recomendedDetails.model.js";
import createError from "../utils/createError.js";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";

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



export const createTextDoc = (req, res) => {
  const { userId } = req.params; // Extract the user ID from the request parameters
  const { content } = req.body;

  // Generate a unique file name using the user ID
  const fileName = `cv_${userId}.txt`;
  const filePath = path.join("./content/generatedTextDoc/", fileName);

  try {
    fs.writeFileSync(filePath, content);

    // Spawn a child process to run the Python script
    const pythonProcess = spawn('python', ['./using_text_recommendation_model.py', filePath]);
console.log(filePath)
    // Handle data from the Python script
    let pythonResponse = "";
    pythonProcess.stdout.on('data', (data) => {
      console.log(`Python Response: ${data}`);
      pythonResponse += data.toString(); 
      // // Assuming the Python script prints a JSON response
      // const jsonResponse = JSON.parse(data);
      // res.status(200).json({ message: "File created successfully", pythonResponse: jsonResponse });
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error("Python Script Error:", data.toString());
      res.status(500).json({ message: "Internal Server Error" });
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
          // return next(createError(500, "Internal server error"));
        }
      } else {
        console.error(`Python script exited with code ${code}`);
        // return next(createError(500, "Internal server error"));
      }
    });
  } catch (error) {
    console.error("Error creating file:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const recommendJobs = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await recomendedDetailsModel.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userCareerPath = user.careerPath;

    // Fetch all jobs from the database
    const allJobs = await Job.find();

    // Convert jobs to JSON string
    const allJobsJson = JSON.stringify(allJobs);

    // Spawn a child process to run the Python script
    const pythonProcess = spawn('python', ['./recommend_jobs_script.py', userCareerPath]);

    // Pass the list of jobs as standard input to the Python script
    pythonProcess.stdin.write(allJobsJson);
    pythonProcess.stdin.end();

    // Handle data from the Python script
    let pythonResponse = '';
    pythonProcess.stdout.on('data', (data) => {
      console.log(`Python Response: ${data}`);
      pythonResponse += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error("Python Script Error:", data.toString());
      res.status(500).json({ message: "Internal Server Error" });
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        try {
          // Parse the JSON response from the Python script
          const recommendedJobs = JSON.parse(pythonResponse);

          res.status(200).json({ recommendedJobs });
        } catch (error) {
          console.error("Error parsing Python script output:", error);
          res.status(500).json({ message: "Internal Server Error" });
        }
      } else {
        console.error(`Python script exited with code ${code}`);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });
  } catch (error) {
    console.error("Error recommending jobs:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
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
