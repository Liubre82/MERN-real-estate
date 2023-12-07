// NOT USED

import express from 'express'
import { createReview, editReview } from '../controllers/review.controllers.js'
import { verifyToken } from '../utils/verifyUser.js'
const router = express.Router()


router.post('/createReview', verifyToken, createReview)

router.post('/getReview/:reviewId/editReview', verifyToken, editReview)

export default router