const mongoose = require('mongoose');
const { schema } = mongoose;

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        reuired: true,
    },
    imageUri: {
        type: String,
        required: true,
    },
    caption: {
        type: String,
        maxlength: 500
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
    ]
});

module.exports = mongoose.model('Post', postSchema);