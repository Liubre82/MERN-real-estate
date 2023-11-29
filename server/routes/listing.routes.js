import express from 'express'
const router = express.Router()
import {createListing, deleteListing, editListing, getListing, getSearchListings} from '../controllers/listing.controllers.js'
import { verifyToken } from '../utils/verifyUser.js'

router.post('/create', verifyToken, createListing)

router.delete('/delete/:listingId', verifyToken, deleteListing)

router.post('/edit/:listingId', verifyToken, editListing)

router.get('/getList/:listingId', getListing)

router.get('/getList', getSearchListings)

export default router