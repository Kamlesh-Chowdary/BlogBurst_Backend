import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      error.message ||
        "Something went wrong while generating access and refresh token"
    );
  }
};

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

const loginUser = asyncHandler(async (req, res) => {
  //get the email and password from frontend
  //find the user
  //validate password
  //generate tokens and save in database
  //send the tokens in cookies
  const { email, password } = req.body;
  if (!email) {
    throw new ApiError(400, "email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User doesn't exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        201,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User Logged in Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  //req.user -> current user data
  //find the user and update  the refreshToken to undefined
  //Clear the cokkies

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: { refreshToken: 1 },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(201, {}, "User Logged out successfully"));
});

const getUsersPosts = asyncHandler(async (req, res) => {
  //get the user from req.user
  //find in database
  //add aggregate pipeline from user model to post model
  //return all posts created by the user

  const user = await User.aggregate([
    {
      $match: {
        _id: req.user?._id,
      },
    },
    {
      $lookup: {
        from: "posts",
        localField: "_id",
        foreignField: "owner",
        as: "userPosts",
        pipeline: [
          {
            $project: {
              title: 1,
              slug: 1,
              content: 1,
              featuredImage: 1,
              status: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        password: 0,
        refreshToken: 0,
        __v: 0,
      },
    },
  ]);

  res
    .status(201)
    .json(new ApiResponse(201, user[0], "Users Posts fetched Succesfully"));
});

export { registerUser, loginUser, logoutUser, getUsersPosts };
