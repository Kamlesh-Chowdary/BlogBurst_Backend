import { Post } from "../models/post.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createPost = asyncHandler(async (req, res) => {
  //get the data from the frontend.
  //validate the data. - not empty.
  //check if the slug value already exists.
  //upload the post file to cloudinary.
  //check if the post got uploaded.
  //create an object and create database entry.
  //check if the post got saved properly.
  //return response to the frontend.

  const { title, slug, status, content } = req.body;

  if ([title, slug, status, content].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existingSlug = await Post.findOne({ slug });
  if (existingSlug) {
    throw new ApiError(409, "This slug value already exits, try another");
  }

  const postLocalFilePath = req.file?.path;

  if (!postLocalFilePath) {
    throw new ApiError(400, "Post file is required");
  }

  const postUrl = await uploadOnCloudinary(postLocalFilePath);
  if (!postUrl) {
    throw new ApiError(400, "Post file is required");
  }

  const post = await Post.create({
    title,
    slug,
    content,
    featuredImage: postUrl,
    status,
    owner: req.user?._id,
  });
  const createdPost = await Post.findById(post._id).select("-__v");
  if (!createdPost) {
    throw new ApiError(500, "Something went wrong while uploading the post");
  }
  res
    .status(200)
    .json(new ApiResponse(201, createdPost, "Post uploaded Successfully"));
});

const getPostById = asyncHandler(async (req, res) => {
  const post_id = req.params.id;
  if (!post_id) {
    throw new ApiError(400, "Post Id is required");
  }

  const post = await Post.findById(post_id).populate("owner", "fullname");
  if (!post) {
    throw new ApiError(401, "Invalid Post Id");
  }
  res.status(200).json(new ApiResponse(201, post, "Post fetched successfully"));
});

export { createPost, getPostById };
