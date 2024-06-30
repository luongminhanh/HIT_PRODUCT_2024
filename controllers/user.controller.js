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

const getUsers = catchAsync(async(req, res) => {
    const {limit = 10, page = 1, sortBy = 'createdAt : desc, fullname: desc'} = req.query;

    const skip = (+page - 1) * +limit;

    const [field, value] = sortBy.split(':');
    const sort = {[field]: value === 'asc' ? 1 : -1};

    const query = {};

    const users = await User.find().limit(limit).skip(skip).sort(sort);

    const totalResults = await User.countDocuments(query);

    res.status(httpStatus.OK).json({
        code: httpStatus.OK,
        message: "Lấy danh sách người dùng thành công",
        data: {
            users,
            limit: +limit,
            currentPage: +page,
            totalPage: Math.ceil(totalResults/+limit),
            totalResults
        }
    })
})

module.exports = {
    createUser,
    getUsers
}
