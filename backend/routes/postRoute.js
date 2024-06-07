import express from "express";
import { createPost, getPosts } from "../controllers/postController.js";
import strictVerifcation from "../middlewares/strictVerification.js";

const router = express.Router();

// GET Requests
router.get("/", getPosts);

// POST Requests
router.post("/create", strictVerifcation, createPost);

// // PUT Requests
// router.put();

// // DELETE Requests
// router.delete();

export default router;
