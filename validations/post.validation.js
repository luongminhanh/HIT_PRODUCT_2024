const joi = require('joi');
const { objectId } = require('./custorm.validation');

const createPost = {
  body: joi.object({
    title: joi.string().min(2).required().messages({
      'any.required': 'Vui lòng nhập tiêu đề bài viết',
    }),
    user: joi.string().required().messages({
      'any.required': 'Vui lòng điền id người dùng đang tạo bài viết',
    }),
    image: joi.string().optional(), 
    description: joi.string().optional(),
  }),
};

const getPosts = {
  query: joi.object({
    sortBy: joi.string(),
    limit: joi.number().integer(),
    page: joi.number().integer(),
  }),
};

const getPostsByUserId = {
  params: joi.object({
    userId: joi.string().required().custom(objectId),
  }),
  query: joi.object({
    sortBy: joi.string(),
    limit: joi.number().integer(),
    page: joi.number().integer(),
  }),
};

const getPostById = {
  params: joi.object({
    postId: joi.string().required().custom(objectId),
  }),
};

const updatePostById = {
  params: joi.object({
    postId: joi.string().required().custom(objectId),
  }),
  body: joi.object({
    title: joi.string().min(2).optional().messages({
      'string.min': 'Tiêu đề bài viết phải có ít nhất 2 ký tự',
      'any.required': 'Vui lòng nhập tiêu đề bài viết',
    }),
    image: joi.string().optional(), 
    description: joi.string().optional(),
  }).or('title', 'image', 'description').messages({
    'object.missing': 'Ít nhất một trong các trường title, image, hoặc description là bắt buộc',
  }),
};

const deletePostById = {
  params: joi.object({
    postId: joi.string().required().custom(objectId),
  }),
};

module.exports = {
  createPost,
  getPostById,
  getPosts,
  getPostsByUserId,
  updatePostById,
  deletePostById
};
