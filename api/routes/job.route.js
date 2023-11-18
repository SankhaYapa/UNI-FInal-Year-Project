// jobRouter.js
import express from "express";
import { getJobs, createJob, addOffer, getJobById, deleteJob } from "../controller/job.controller.js";

const router = express.Router();

// GET all jobs
router.get("/", getJobs);
router.get("/:id", getJobById);
router.delete("/:id",deleteJob);
// POST a new job
router.post("/", createJob);
router.post("/offer/:id", addOffer);
export default router;
