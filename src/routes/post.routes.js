import { upload } from "../middlewares/multer.middleware.js";
import { Router } from "express";
import { createPost, getPostById } from "../controllers/post.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";
const postRouter = Router();

// Apply verifyUser middleware to all routes in this file
postRouter.use(verifyUser);
postRouter
  .route("/create-post")
  .post(upload.single("featuredImage"), createPost);
postRouter.route("/:id").get(getPostById);
export { postRouter };
