import express from 'express'
import { createReview } from '../controllers/review.controllers.js'
import { verifyToken } from '../utils/verifyUser.js'
const router = express.Router()


router.post('/createReview', verifyToken, createReview)

export default router