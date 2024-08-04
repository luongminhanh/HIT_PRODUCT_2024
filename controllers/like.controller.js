const Post = require('../models/post.model');
const Like = require('../models/like.model');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const toggleLikePost = catchAsync(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;
  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy bài viết');
  }

  const alreadyLiked = await Like.findOne({ post: postId, user: userId });
  if (alreadyLiked) {
    await Like.deleteOne({ post: postId, user: userId });
    post.like -= 1;
    await post.save();

    return res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      message: 'Hủy thích bài viết thành công',
      data: {
        post
      }
    });
  }
  await Like.create({
    post: postId,
    user: userId,
  });
  post.like += 1;
  await post.save();

  return res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: 'Thích bài viết thành công',
    data: {
        post
    }
  });
});

const checkUserLike = catchAsync(async (req, res) => {
  const { postId } = req.params;
  const userId = req.user.id;

  const post = await Post.findById(postId);

  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy bài viết');
  }

  const alreadyLiked = await Like.findOne({ post: postId, user: userId });
  const isLiked = !!alreadyLiked;

  return res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: isLiked ? 'Người dùng đã like bài viết này' : 'Người dùng chưa like bài viết này',
    data: {
        post,
        isLiked
    }
  });
});

module.exports = {
  toggleLikePost,
  checkUserLike
};
