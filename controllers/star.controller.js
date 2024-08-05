const Comment = require('../models/comment.model');
const Star = require('../models/star.model');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const toggleStarComment = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.id;
  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy bình luận');
  }

  const alreadyStar = await Star.findOne({ comment: commentId, user: userId });
  if (alreadyStar) {
    await Star.deleteOne({ comment: commentId, user: userId });
    comment.star -= 1;
    await comment.save();

    return res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      message: 'Hủy thích bình luận thành công',
      data: {
        comment
      }
    });
  }

  await Star.create({
    comment: commentId,
    user: userId,
  });
  comment.star += 1;
  await comment.save();

  return res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: 'Thích bình luận thành công',
    data: {
      comment
    }
  });
});

const checkUserStar = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user.id;

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy bình luận');
  }

  const userStar = await Star.findOne({ comment: commentId, user: userId });
  const isStarred = !!userStar;

  return res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: isStarred ? 'Người dùng đã thích bình luận này' : 'Người dùng chưa thích bình luận này',
    data: { comment, isStarred },
  });
});

module.exports = {
  toggleStarComment,
  checkUserStar
};
