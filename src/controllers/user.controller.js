import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";

const registerUser = asyncHandler(async (req, res) => {
  //get the data from frontend.
  //check that all the values are valid - not empty
  //check if user already exists - email
  //create user object-create database entry
  //remove password and refreshtoken in the response
  //check for user creation
  //return response to the frontend

  const { fullname, email, password } = req.body;

  /* Basic syntax
  if (
    fullname?.trim() === "" ||
    email?.trim() === "" ||
    password?.trim() === ""
  ) {
    throw new ApiError(400, "All fields are required");
  } 
  */

  if ([fullname, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  const user = await User.create({
    fullname,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -__v"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  res
    .status(200)
    .json(new ApiResponse(201, createdUser, "User registered Successfully"));
});

export { registerUser };
