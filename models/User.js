const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            trim: true,
            lowercase: true,
            // match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            select: false
            // minlength: [6, 'Password must be at least 6 characters long']
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);
