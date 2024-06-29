const multer = require('multer');
const httpStatus = require('http-status');

const ApiError = require('../utils/ApiError');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.').pop();
    cb(null, file.fieldname + '-' + Date.now() + '.' + ext);
  },
});

const fileFilter = (req, file, cb) => {
  if (['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(httpStatus.BAD_REQUEST, 'Định dạng ảnh không hỗ trợ'), false);
  }
};

const limitFileSize = 0.5 * 1024 * 1024;

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: limitFileSize,
  },
});

module.exports = upload;
