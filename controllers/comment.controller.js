const { cloudinary } = require('../configs/cloudinary.config');
const Comment = require('../models/comment.model');
const Post = require('../models/post.model');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const createComment = catchAsync(async (req, res) => {
  const { postId, content } = req.body;
  const userId = req.user.id;

  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy bài viết');
  }

  const comment = await Comment.create({ post: postId, user: userId, content });

  const file = req.file;
  if (file) {
    const image = await cloudinary.uploader.upload(file.path);
    comment.image = image.url;
    await comment.save();
  }

  const io = req.app.get('socketio');
  io.emit('newComment', comment);

  res.status(httpStatus.CREATED).json({
    code: httpStatus.CREATED,
    message: 'Bình luận thành công',
    data: {
        comment
    },
  });
});

const getCommentsByPost = catchAsync(async (req, res) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy bài viết');
  }

  const comments = await Comment.find({ post: postId }).populate('user', 'name');
  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: `Lấy danh sách bình luận của bài viết có tiêu đề ${post.title} thành công`,
    data: {
      comments,
    },
  });
});

const updateComment = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy bình luận');
  }

  comment.content = content;
  const file = req.file;
  if (file) {
    const image = await cloudinary.uploader.upload(file.path);
    comment.image = image.url;
  }
  await comment.save();

  const io = req.app.get('socketio');
  io.emit('updateComment', comment);

  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: 'Chỉnh sửa bình luận thành công',
    data: {
        comment
    },
  });
});

const deleteComment = catchAsync(async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findByIdAndDelete(commentId);

  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy bình luận cần xóa');
  }

  const io = req.app.get('socketio');
  io.emit('deleteComment', commentId);

  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: 'Xóa bình luận thành công',
    data: {
      comment,
    },
  });
});

module.exports = {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteComment,
};
