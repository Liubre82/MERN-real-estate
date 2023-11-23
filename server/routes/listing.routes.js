import express from 'express'
const router = express.Router()
import {createListing, deleteListing} from '../controllers/listing.controllers.js'
import { verifyToken } from '../utils/verifyUser.js'

router.post('/create', verifyToken, createListing)

router.delete('/delete/:listingId', verifyToken, deleteListing)

export default router