import { Router } from "express";
import {
  getCurrentUser,
  getUsersPosts,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);

//secured routes
userRouter.route("/logout").post(verifyUser, logoutUser);
userRouter.route("/user-posts").get(verifyUser, getUsersPosts);
userRouter.route("/current-user").get(verifyUser, getCurrentUser);

export { userRouter };
