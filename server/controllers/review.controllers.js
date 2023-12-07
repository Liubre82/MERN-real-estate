//NOT USED 

import Review from '../models/review.model.js'
import { errorHandler } from '../utils/error.js'

export const createReview = async (req, res, next) => {
    try {                     
        const review = await Review.create(req.body)
        return res.status(201).json(review)
    } catch(err) {
        next(err)
    }
}

export const editReview = async (req, res, next) => {
    try {
        const { reviewId } = req.params
        const findReview = await Review.findById(reviewId)
        if(!findReview) {
            return next(errorHandler(401, 'review is not found!'))
        }
        if(JSON.stringify(req.user.id) !== JSON.stringify(findReview.author)) {
            return next(errorHandler(404, 'You can only edit your own review!'))
        }
        const updateReview = await Review.findByIdAndUpdate(reviewId, req.body, { new: true })
        res.status(200).json(updateReview);
    } catch(err) {
        next(err)
    }
}
