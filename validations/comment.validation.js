const joi = require('joi');
const { objectId } = require('./custorm.validation');

const createComment = {
  body: joi.object().keys({
    postId: joi.string().required().custom(objectId).messages({
      'any.required': 'Vui lòng nhập id của bài viết',
    }),
    content: joi.string().required().messages({
      'any.required': 'Vui lòng nhập nội dung bình luận bài viết',
    }),
    image: joi.string().optional(),
  }),
};

const getCommentsByPost = {
  params: joi.object({
    postId: joi.string().required().custom(objectId).messages({
      'any.required': 'Vui lòng nhập id của bài viết',
    }),
  }),
};

const updateComment = {
  params: joi.object({
    commentId: joi.string().required().custom(objectId).messages({
      'any.required': 'Vui lòng nhập id của bình luận cần sửa',
    }),
  }),
  body: joi.object().keys({
    content: joi.string().required().messages({
      'any.required': 'Vui lòng nhập nội dung bình luận bài viết',
    }),
    image: joi.string().optional(),
  }),
};

const deleteCommentsById = {
  params: joi.object({
    commentId: joi.string().required().custom(objectId).messages({
      'any.required': 'Vui lòng nhập id của bình luận cần xóa',
    }),
  }),
};

module.exports = {
  createComment,
  getCommentsByPost,
  updateComment,
  deleteCommentsById,
};
