import express from 'express'
const router = express.Router()
import {createListing, deleteListing, editListing, getAllListings, getListing, getSearchListings, createReview, deleteReview, editReview} from '../controllers/listing.controllers.js'
import { verifyToken } from '../utils/verifyUser.js'


//get all listings that were posted from all users.(retrieves entire listings collection)
router.get('/allListings', getAllListings)

//get listings based on the queryStrings/filtered listings
router.get('/getList', getSearchListings)

//get a unique/specific listing from the listings collection
router.get('/getList/:listingId', getListing)

//create a new listing to the listings collection
router.post('/create', verifyToken, createListing)

//edit a specific existing listing
router.post('/edit/:listingId', verifyToken, editListing)

//create a new review to the reviews collection of a specific listing, & add the review to the listing.reviews array
router.post('/getList/:listingId/createReview', verifyToken, createReview)

router.post('/getList/:listingId/getReview/:reviewId/editReview', verifyToken, editReview)

//delete a specific listing from the listings collection
router.delete('/delete/:listingId', verifyToken, deleteListing)

//delete a specific review from the listings.reviews array and the reviews collection
router.delete('/getList/:listingId/deleteReview/:reviewId', verifyToken, deleteReview)





export default router