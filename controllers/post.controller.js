const httpStatus = require('http-status');
const { cloudinary } = require('../configs/cloudinary.config');
const Post = require('../models/post.model');
const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const createPost = catchAsync(async (req, res) => {
    console.log(req);
    const existingUser = await User.findById(req.body.user);

    if (!existingUser) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy người dùng đang tạo bài viết');
    }

    const newPost = await Post.create(req.body);

    const file = req.file;
    if (file) {
        const image = await cloudinary.uploader.upload(file.path);
        newPost.image = image.url;
        await newPost.save();
    }

    res.status(httpStatus.CREATED).json({
        message: 'Tạo bài viết thành công',
        code: httpStatus.CREATED,
        data: {
            post: newPost,
        },
    });
});


module.exports = {
    createPost
}
