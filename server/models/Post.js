const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    lastUpdated: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Posts', PostSchema);