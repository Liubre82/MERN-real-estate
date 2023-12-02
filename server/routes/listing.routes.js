import express from 'express'
const router = express.Router()
import {createListing, deleteListing, editListing, getAllListings, getListing, getSearchListings} from '../controllers/listing.controllers.js'
import { verifyToken } from '../utils/verifyUser.js'

router.post('/create', verifyToken, createListing)

router.get('/allListings', getAllListings)

router.get('/getList', getSearchListings)

router.delete('/delete/:listingId', verifyToken, deleteListing)

router.post('/edit/:listingId', verifyToken, editListing)

router.get('/getList/:listingId', getListing)






export default router