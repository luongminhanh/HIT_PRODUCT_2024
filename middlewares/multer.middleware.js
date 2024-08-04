const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); 
  },
  filename: function (req,file, cb ){
    cb(null, file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if (['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ hỗ trợ định dạng PNG, JPG, JPEG'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 0.5 * 1024 * 1024, 
  },
});

module.exports = upload;
