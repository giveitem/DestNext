const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reviewSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    body: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Review', reviewSchema);