const httpStatus = require('http-status');
const { cloudinary } = require('../configs/cloudinary.config');
const Post = require('../models/post.model');
const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const createPost = catchAsync(async (req, res) => {
  const existingUser = await User.findById(req.body.user);

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy người dùng đang tạo bài viết');
  }

  const newPost = await Post.create(req.body);

  const file = req.file;
  if (file) {
    const image = await cloudinary.uploader.upload(file.path);
    newPost.image = image.url;
    await newPost.save();
  }

  res.status(httpStatus.CREATED).json({
    message: 'Tạo bài viết thành công',
    code: httpStatus.CREATED,
    data: {
      post: newPost,
    },
  });
});

const getPosts = catchAsync(async (req, res) => {
  const { limit = 10, page = 1, sortBy = 'createdAt : desc, fullname: desc' } = req.query;

  const skip = (+page - 1) * +limit;

  const [field, value] = sortBy.split(':');
  const sort = { [field]: value === 'asc' ? 1 : -1 };

  const query = {};

  const posts = await Post.find().limit(limit).skip(skip).sort(sort);

  const totalResults = await Post.countDocuments(query);

  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: 'Lấy danh sách bài viết thành công',
    data: {
      posts,
      limit: +limit,
      currentPage: +page,
      totalPage: Math.ceil(totalResults / +limit),
      totalResults,
    },
  });
});

const getPostsByUserId = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy người dùng');
  }

  const { limit = 10, page = 1, sortBy = 'createdAt:desc' } = req.query;

  const skip = (+page - 1) * +limit;

  const [field, value] = sortBy.split(':');
  const sort = { [field]: value === 'asc' ? 1 : -1 };

  const query = { user: userId };

  const posts = await Post.find(query).limit(+limit).skip(skip).sort(sort);
  const totalResults = await Post.countDocuments(query);

  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: `Lấy danh sách bài viết của người dùng ${user.fullname} thành công`,
    data: {
      posts,
      limit: +limit,
      currentPage: +page,
      totalPage: Math.ceil(totalResults / +limit),
      totalResults,
    },
  });
});

const getPostById = catchAsync(async (req, res) => {
  const postId = req.params.postId;

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy bài viết');
  }

  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: 'Lấy thông tin bài viết thành công',
    data: {
      post,
    },
  });
});

const updatePostById = catchAsync(async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy bài viết cần sửa');
  }

  if (req.body.user) {
    delete req.body.user;
  }

  Object.assign(post, req.body);

  if (req.file) {
    const image = await cloudinary.uploader.upload(req.file.path);
    post.image = image.url;
  }

  await post.save();

  res.status(httpStatus.OK).json({
    message: 'Cập nhật thông tin bài viết thành công',
    code: httpStatus.OK,
    data: {
      post,
    },
  });
});

const deletePostById = catchAsync(async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.postId);

  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, `Không tìm bài viết`);
  }

  res.status(httpStatus.OK).json({
    message: `Xoá bài viết dùng thành công`,
    code: httpStatus.OK,
    data: {
      post,
    },  
  });
});

module.exports = {
  createPost,
  getPosts,
  getPostById,
  getPostsByUserId,
  updatePostById,
  deletePostById
};
