import express from "express";
import { deleteUser, getUser, uploadCv } from "../controller/user.controller.js";
import { verifyToken } from "../middleware/jwt.js";


const router = express.Router();

router.delete("/:id",verifyToken, deleteUser);
router.get("/:id",verifyToken, getUser);
router.post("/upload-cv",uploadCv)
export default router;
