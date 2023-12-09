import express from 'express'
const router = express.Router()
import {createListing, deleteListing, editListing, getAllListings, getListing, getSearchListings, createReview, deleteReview, editReview} from '../controllers/listing.controllers.js'
import { verifyToken } from '../utils/verifyUser.js'


//returns the entire listings collection
router.get('/', getAllListings)

//return an array of listings based on the queryStrings/filtered listings
router.get('/listings', getSearchListings)

//returns a unique listing from the listings collection
router.get('/:listingId', getListing)

//returns the newly created listing obj
router.post('/', verifyToken, createListing)

//returns the editted/updated unique listing obj
router.post('/:listingId/edit', verifyToken, editListing)

/* create a new review to the reviews collection of a specific listing, & add the review to the listing.reviews array. 
* returns an array of 2 objs. 
* [{Listing obj with the newly created review added to its reviews array field}, {newly created review obj}] */
router.post('/:listingId/reviews', verifyToken, createReview)

/* //update/edit the review obj in the reviews collection. 
returns an array of 2 objs. 
[{Listing obj with the review updated in its reviews array field}, {newly updated review obj that was updated}] */
router.post('/:listingId/reviews/:reviewId/edit', verifyToken, editReview)

//returns the listing obj that was deleted.
router.delete('/:listingId', verifyToken, deleteListing)

/* delete a specific review from the listings.reviews array and the reviews collection. 
* returns the listing obj without the deleted review in its reviews array. */
router.delete('/:listingId/reviews/:reviewId', verifyToken, deleteReview)

export default router