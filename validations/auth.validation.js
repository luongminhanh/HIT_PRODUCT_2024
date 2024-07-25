const joi = require('joi');
const { password } = require('./custorm.validation');

const register = {
  body: joi.object({
    fullname: joi.string().min(2).max(45).required().messages({
      'any.required': 'Vui lòng điền tên người dùng',
    }),
    email: joi.string().email().required().messages({
      'any.required': 'Vui lòng điền email',
    }),
    password: joi.string().required().custom(password),
  }),
};

const login = {
  body: joi.object({
    email: joi.string().email().required().messages({
      'any.required': 'Vui lòng điền email',
    }),
    password: joi.string().required().custom(password),
  }),
};

const changePassword = {
  body: joi.object({
    oldPassword: joi.string().required().custom(password),
    newPassword: joi.string().required().custom(password).not(joi.ref('oldPassword')).messages({
      'any.invalid': 'Mật khẩu mới không được trùng với mật khẩu cũ',
    }),
    repeatPassword: joi.string().min(6).max(30).required().valid(joi.ref('newPassword')).messages({
      'any.only': 'Mật khẩu nhập lại không khớp',
    }),
  }),
};

module.exports = {
  register,
  login,
  changePassword
};
