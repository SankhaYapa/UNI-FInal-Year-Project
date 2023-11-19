import Job from "../models/job.model.js";

export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createJob = async (req, res) => {
  const { userId, desc, days, budget } = req.body;

  try {
    const newJob = new Job({
      userId,
      desc,
      days,
      budget,
    });

    const savedJob = await newJob.save();

    // Call the function to recommend jobs after creating a new job
    await recommendJobs();

    res.json(savedJob);
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const recommendJobs = async () => {
  try {
    const jobs = await Job.find();

    // Array to store recommended career paths along with job details
    const recommendedJobs = [];

    // Process jobs concurrently
    await Promise.all(
      jobs.map(async (job) => {
        try {
          // Run the Python script using spawn, passing the job details as a command-line argument
          const pythonProcess = spawn('python', ['./recommend_jobs_script.py', JSON.stringify({ jobId: job._id, jobDescription: job.desc })]);

          // Collect data from the Python script
          let scriptOutput = '';

          pythonProcess.stdout.on('data', (data) => {
            scriptOutput += data.toString();
          });

          pythonProcess.stderr.on('data', (data) => {
            console.error('Python Script Error:', data.toString());
          });

          await new Promise((resolve) => {
            pythonProcess.on('close', async (code) => {
              console.log('Python script execution completed with exit code:', code);
              if (code === 0) {
                // Parse the JSON response from the Python script
                const recommendedCareerPath = JSON.parse(scriptOutput);
                await Job.findByIdAndUpdate(job._id, {
                  recommendedCareerPath: recommendedCareerPath.recommended_career_path,
                });

                // Add the job details and recommended career path to the array
                recommendedJobs.push({
                  jobId: job._id,
                  jobDescription: job.desc,
                  recommendedCareerPath: recommendedCareerPath.recommended_career_path,
                });

                resolve();
              } else {
                console.error('Python Script Error. Exit code:', code);
                console.log('Python script output:', scriptOutput); // Add this line for debugging
                resolve();
              }
            });
          });
        } catch (error) {
          console.error('Error processing job:', error);
        }
      })
    );

    // You might want to return or log the recommendedJobs array
    console.log('Recommended Jobs:', recommendedJobs);

    return recommendedJobs;
  } catch (error) {
    console.error('Error recommending jobs:', error);
    throw error;
  }
};
export const getJobById = async (req, res) => {
    const jobId = req.params.id;
  
    try {
      const job = await Job.findById(jobId);
  
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }
  
      res.json(job);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
export const addOffer = async (req, res) => {
  const { userId, offerPrice } = req.body;
  const jobId = req.params.id;
  
  try {
    const job = await Job.findById(jobId);
console.log(job)
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    const newOffer = {
      userId: userId,
      price: offerPrice,
    };
console.log(newOffer)

    job.offers.push(newOffer);

    const updatedJob = await job.save();
    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// Import necessary modules

// Import necessary modules

export const deleteJob = async (req, res) => {
    const jobId = req.params.id; // Assuming you pass the job ID in the URL parameter
  
    try {
      const job = await Job.findByIdAndDelete(jobId);
  
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }
  
      res.json({ message: "Job deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  export const getJobsByCareerPath = async (req, res) => {
    const careerPath = req.params.careerPath;
  
    try {
      const jobs = await Job.find({ recommendedCareerPath: careerPath });
      res.json(jobs);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };