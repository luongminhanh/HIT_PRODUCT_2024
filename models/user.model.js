const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { USER_ROLE_ENUM, SALT_WORK_FACTOR } = require('../constants');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      select: false,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      default: '2000-01-01',
    },
    isLock: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      trim: true,
      default: 'https://th.bing.com/th/id/OIP.z3fa8PjEnvzg4bhW61tEOwAAAA?rs=1&pid=ImgDetMain',
    },
    role: {
      type: String,
      enum: USER_ROLE_ENUM,
      default: USER_ROLE_ENUM.MEMBER,
    },
    star: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, SALT_WORK_FACTOR);
  }
  next();
});

userSchema.methods.isMatchPassword = async function (password) {
  const user = this;
  return await bcrypt.compare(password, user.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
