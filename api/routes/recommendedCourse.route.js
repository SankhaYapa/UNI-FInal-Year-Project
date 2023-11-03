import express from "express";
import { getCourse } from "../controller/recommendedCourse.controller.js";

const router = express.Router();

router.get("/:userId", getCourse);
// router.post("/", postCourse);

export default router;
