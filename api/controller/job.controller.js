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
    res.json(savedJob);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
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
  