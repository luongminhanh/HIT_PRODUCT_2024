const { cloudinary } = require('../configs/cloudinary.config');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const mailer = require('../utils/mailer');
const {generateAccessToken, generateRefreshToken} = require('../utils/generateTokens')

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
      </div>
    `;
  await mailer.sendMail(to, subject, htmlContent);

  res.status(httpStatus.CREATED).json({
    code: httpStatus.CREATED,
    message: 'Đăng ký người dùng thành công',
    data: [],
  });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.isMatchPassword(password))) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tài khoản hoặc mật khẩu không chính xác');
  }

  if (user.isLocked) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Tài khoản đã bị khoá');
  }

  user.password = undefined;

  const accessToken = generateAccessToken({ id: user._id });
  const refreshToken = generateRefreshToken({id: user._id})

  res.status(httpStatus.OK).json({
    message: 'Đăng nhập thành công',
    code: httpStatus.OK,
    data: {
      user,
      accessToken,
      refreshToken
    },
  });
});

const refreshToken = catchAsync(async(req, res) => {
  const { refreshToken } = req.body;

  jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET, async(err, user) => {
    if(err){
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Vui lòng đăng nhập hệ thống');
    }

    
    const currentUser = await User.findById(user.id);
    if (!currentUser) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Vui lòng đăng nhập hệ thống');
    }

    const accessToken = generateAccessToken({ id: currentUser._id });

    res.status(httpStatus.OK).json({
      code: httpStatus.OK,
      message: "Làm mới token thành công",
      data: {
        accessToken,
      }
    })
  })
})

const changePassword = catchAsync(async(req, res) => {
  const user = await User.findById(req.user.id).select("+password");

  if(!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy người dùng.');
  }

  if (!(await user.isMatchPassword(req.body.oldPassword))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Mật khẩu cũ không chính xác');
  }

  Object.assign(user, { password: req.body.newPassword });

  await user.save();

  res.status(httpStatus.OK).json({
    message: 'Đổi mật khẩu thành công',
    code: httpStatus.OK,
    data: {
      user,
    },
  });
})

const changeUserProfile = catchAsync(async(req, res) => {
  const user = await User.findById(req.user.id);
  
  Object.assign(user, req.body);
  
  const file = req.file;
  if(file){
    const avatar = await cloudinary.uploader.upload(file.path);
    user.avatar = avatar.url;
  }

  user.save();

  res.status(httpStatus.OK).json({
    code: httpStatus.OK,
    message: "Thay đổi thông tin người dùng thành công",
    data: {
      user
    }
  })
})



module.exports = {
  register,
  login,
  refreshToken,
  changePassword,
  changeUserProfile
};
