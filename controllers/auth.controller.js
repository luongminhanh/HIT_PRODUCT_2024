const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const mailer = require('../utils/mailer');

const register = catchAsync(async (req, res, next) => {
  const existingEmail = await User.findOne({ email: req.body.email });
  if (existingEmail) {
    throw new ApiError(httpStatus.CONFLICT, 'Địa chỉ email đã tồn tại');
  }

  await User.create(req.body);

  const to = req.body.email;
  const subject = 'Đăng ký tài khoản thành công';
  const htmlContent = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="color: #333;">Chúc mừng bạn đã đăng ký thành công!</h1>
        <p style="color: #666; font-size: 16px;">Bạn có thể bắt đầu sử dụng ứng dụng của chúng tôi ngay bây giờ.</p>
        <a href="#" style="display: inline-block; background-color: #007bff; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 4px; font-size: 14px;">Truy cập ứng dụng</a>
      </div>
    `;
  await mailer.sendMail(to, subject, htmlContent);

  res.status(httpStatus.CREATED).json({
    code: httpStatus.CREATED,
    message: 'Đăng ký người dùng thành công',
    data: [],
  });
});

module.exports = {
  register,
};
