import express from "express";
import { getCourse, getUserCreerPath } from "../controller/recommendedCourse.controller.js";

const router = express.Router();

router.get("/:userId", getCourse);
// router.post("/", postCourse);
router.get("/careerPath/:userId",getUserCreerPath)
export default router;
