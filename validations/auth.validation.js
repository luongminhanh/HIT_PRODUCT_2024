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

const refreshToken = {
  body: joi.object({
    refreshToken: joi.string().required().messages({
      'any.required': 'Vui lòng điền refresh token',
    })
  })
}

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

const changeUserProfile = {
  body: joi.object().keys({
    fullname: joi.string().min(2).max(45).optional().messages({
      'string.base': 'Họ tên phải là một chuỗi',
      'string.min': 'Họ tên phải có ít nhất 2 ký tự',
      'string.max': 'Họ tên không được vượt quá 45 ký tự',
      'any.required': 'Vui lòng điền họ tên người dùng',
    }),
    gender: joi.string().optional().valid('Nam', 'Nữ').messages({
      'any.only': 'Giới tính chỉ có thể là "Nam" hoặc "Nữ"'
    }),
    dateOfBirth: joi.date().max('now').iso().optional().messages({
      'date.base': 'Ngày sinh phải là một ngày hợp lệ',
      'date.format': 'Ngày sinh phải có định dạng hợp lệ (YYYY-MM-DD)',
      'date.max': 'Ngày sinh không được lớn hơn thời gian hiện tại',
    }),
    avatar: joi.string().optional(),
  }).or('fullname', 'gender', 'dateOfBirth', 'avatar').messages({
    'object.missing': 'Ít nhất một trong các trường fullname, gender, dateOfBirth hoặc avatar là bắt buộc',
  })
}

const sendOtp = {
  body: joi.object().keys({
    email: joi.string().email().required().messages({
      'string.email': 'Email không hợp lệ',
      'string.empty': 'Email không được để trống',
      'any.required': 'Email là bắt buộc'
    })
  })
};

const verifyOtp = {
  body: joi.object().keys({
    email: joi.string().email().required().messages({
      'string.email': 'Email không hợp lệ',
      'string.empty': 'Email không được để trống',
      'any.required': 'Email là bắt buộc'
    }),
    otp: joi.string().length(6).required().messages({
      'string.length': 'Mã OTP phải có độ dài 6 ký tự',
      'string.empty': 'Mã OTP không được để trống',
      'any.required': 'Mã OTP là bắt buộc'
    })
  })
};

const resetPassword = {
  body: joi.object().keys({
    email: joi.string().email().required().messages({
      'string.email': 'Email không hợp lệ',
      'string.empty': 'Email không được để trống',
      'any.required': 'Email là bắt buộc'
    }),
    password: joi.string().min(6).required().messages({
      'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
      'string.empty': 'Mật khẩu không được để trống',
      'any.required': 'Mật khẩu là bắt buộc'
    }),
    confirmPassword: joi.string().valid(joi.ref('password')).required().messages({
      'any.only': 'Mật khẩu xác nhận không khớp',
      'string.empty': 'Xác nhận mật khẩu không được để trống',
      'any.required': 'Xác nhận mật khẩu là bắt buộc'
    })
  })
};

module.exports = {
  register,
  login,
  changePassword,
  changeUserProfile,
  refreshToken,
  sendOtp,
  verifyOtp,
  resetPassword
};
