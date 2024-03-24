import { upload } from "../middlewares/multer.middleware.js";
import { Router } from "express";
import {
  createPost,
  deleteFeaturedImage,
  getAllPosts,
  getPostById,
  updatePost,
  updatefeaturedImage,
} from "../controllers/post.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";
const postRouter = Router();

// Apply verifyUser middleware to all routes in this file
postRouter.use(verifyUser);

postRouter
  .route("/create-post")
  .post(upload.single("featuredImage"), createPost);

postRouter.route("/get-posts").get(getAllPosts);
postRouter.route("/:id").get(getPostById);
postRouter.route("/update-post/:slug_id").patch(updatePost);
postRouter
  .route("/update-image/:slug_id")
  .patch(upload.single("featuredImage"), updatefeaturedImage);
postRouter.route("/delete-image").delete(deleteFeaturedImage);
export { postRouter };
