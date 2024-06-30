const httpStatus = require('http-status');
const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const createUser = catchAsync(async (req, res) => {
    const existingEmail = await User.findOne({email: req.body.email});
    if(existingEmail){
        throw new ApiError(httpStatus.CONFLICT, "Emaild đã tồn tại");
    }

    
    const user = await User.create(req.body);
    user.password = undefined;
    
    return res.status(httpStatus.CREATED).json({
        code: httpStatus.CREATED,
        message: "Tạo người dùng thành công",
        data: {
            user
        }
    })
});

module.exports = {
    createUser
}
