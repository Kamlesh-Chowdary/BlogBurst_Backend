import { upload } from "../middlewares/multer.middleware.js";
import { Router } from "express";
import { createPost, getPostById } from "../controllers/post.controller.js";
const postRouter = Router();

postRouter.route("/create-post").post(upload.single("post"), createPost);
postRouter.route("/:id").get(getPostById);
export { postRouter };
