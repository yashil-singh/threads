import express from "express";
import {
  createPost,
  deletePost,
  getPostById,
  getPostByUserId,
  getPosts,
  toggleLike,
  toggleRepost,
} from "../controllers/postController.js";
import strictVerifcation from "../middlewares/strictVerification.js";

const router = express.Router();

// GET Requests
router.get("/", getPosts);
router.get("/:id", getPostById);
router.get("/user/:userId", getPostByUserId);

// POST Requests
router.post("/create", strictVerifcation, createPost);
router.post("/toggle-like/:id", strictVerifcation, toggleLike);
router.post("/toggle-repost/:id", strictVerifcation, toggleRepost);

// // PUT Requests
// router.put();

// DELETE Requests
router.delete("/:postId", strictVerifcation, deletePost);

export default router;
