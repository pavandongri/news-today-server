const mongoose = require("mongoose");

const storySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            unique: true,
            trim: true
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true
        },
        imageUrl: {
            type: String,
            trim: true,
            default: ''
        },
        keywords: {
            type: String,
            required: [true, 'Keywords are required']
        },
        cards: {
            type: [String],
            required: [true, 'cards are required']
        },
        author: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: [true, 'Author is required']
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'active'
        },
        slug: {
            type: String,
            // required: [true, 'Author is required']
        },
        viewCount: {
            type: Number,
            default: 0,
            min: [0, 'View count cannot be negative']
        },
        categories: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Story", storySchema);
