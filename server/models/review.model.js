import mongoose from 'mongoose'

const reviewSchema = mongoose.Schema({
    rating: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{ timestamps: true })


const Review = mongoose.model('Review', reviewSchema)

export default Review