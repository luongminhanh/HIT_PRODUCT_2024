const { required } = require('joi');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        email: {
            type: String,
            trim: true,
            unique: true,
            required: true
        },
        fullName:{
            type: String,
            required: true,
            trim: true
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
    }
)
