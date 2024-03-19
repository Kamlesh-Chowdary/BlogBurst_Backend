import { upload } from "../middlewares/multer.middleware.js";
import { Router } from "express";
import { createPost } from "../controllers/post.controller.js";
const postRouter = Router();

postRouter.route("/create-post").post(upload.single("post"), createPost);

export { postRouter };
