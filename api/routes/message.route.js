import express from "express";

import { verifyToken } from "../middleware/jwt.js";
import { createMessage, getMessages } from "../controller/message.controller.js";

const router = express.Router();

router.post("/", createMessage);
router.get("/:id", getMessages);

export default router;
