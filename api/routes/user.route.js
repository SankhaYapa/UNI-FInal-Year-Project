import express from "express";
import { createTextDoc, deleteUser, getUser, recommendJobs, uploadCv } from "../controller/user.controller.js";
import { verifyToken } from "../middleware/jwt.js";


const router = express.Router();


router.delete("/:id",verifyToken, deleteUser);
router.get("/:id", getUser);
router.post("/upload-cv",uploadCv)
router.post("/create-file/:userId",createTextDoc)
router.post("/recommendJobs/:userId",recommendJobs)
export default router;
