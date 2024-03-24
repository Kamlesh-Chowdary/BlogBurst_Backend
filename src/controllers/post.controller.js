import { Post } from "../models/post.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import {
  deleteFileOnCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

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

  const imageResponse = await uploadOnCloudinary(postLocalFilePath);
  if (!imageResponse) {
    throw new ApiError(400, "Post file is required");
  }

  const post = await Post.create({
    title,
    slug,
    content,
    featuredImage: imageResponse.secure_url,
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

const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({});

  res
    .status(200)
    .json(new ApiResponse(200, posts, "All posts fethced successfully"));
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

const updatePost = asyncHandler(async (req, res) => {
  const { slug_id } = req.params;

  if (!slug_id) {
    throw new ApiError(404, "Slug value is missing");
  }
  const { title, slug, content, status } = req.body;

  if ([title, slug, status, content].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const updatedPost = await Post.findOneAndUpdate(
    { slug: slug_id },
    {
      title,
      slug,
      content,
      status,
    },
    {
      new: true,
    }
  );

  res
    .status(200)
    .json(new ApiResponse(200, updatedPost, "Post Updated Successfully"));
});

const updatefeaturedImage = asyncHandler(async (req, res) => {
  const featuredImageLocalPath = req.file?.path;
  const { slug_id } = req.params;
  if (!featuredImageLocalPath) {
    throw new ApiError(400, "featuredImage file is missing");
  }

  const featuredImage = await uploadOnCloudinary(featuredImageLocalPath);
  if (!featuredImage) {
    throw new ApiError(400, "Error uploading the new image");
  }

  const updatedPost = await Post.findOneAndUpdate(
    { slug: slug_id },
    {
      featuredImage: featuredImage.secure_url,
    },
    { new: true }
  );
  res
    .status(200)
    .json(new ApiResponse(200, updatedPost, "Image updated successfully"));
});

const deleteFeaturedImage = asyncHandler(async (req, res) => {
  const imageUrl = req.body?.featuredImage;
  if (!imageUrl) {
    throw new ApiError(400, "Image URL is required");
  }
  console.log(imageUrl);

  const response = await deleteFileOnCloudinary(imageUrl);
  if (!response) {
    throw new ApiError(400, "Error deleting the file");
  }
  res
    .status(200)
    .json(new ApiResponse(200, response, "File deleted successfully"));
});

export {
  createPost,
  getPostById,
  getAllPosts,
  updatePost,
  updatefeaturedImage,
  deleteFeaturedImage,
};
