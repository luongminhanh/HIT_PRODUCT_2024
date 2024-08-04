const joi = require('joi');

const createPost = {
  body: joi.object({
    title: joi.string().min(2).required().messages({
      'any.required': 'Vui lòng nhập tiêu đề bài viết',
    }),
    user: joi.string().required().messages({
      'any.required': 'Vui lòng điền id người dùng đang tạo bài viết',
    }),
  }),
};

module.exports = {
  createPost,
};
