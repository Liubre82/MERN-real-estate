import express from 'express'
const router = express.Router()
import {createListing, deleteListing, editListing, getAllListings, getListing, getSearchListings, createReview, deleteReview, editReview} from '../controllers/listing.controllers.js'
import { verifyToken } from '../utils/verifyUser.js'


//get all listings that were posted from all users.(retrieves entire listings collection) returns an array of all the listing objs
router.get('/allListings', getAllListings)

//return listings based on the queryStrings/filtered listings
router.get('/getList', getSearchListings)

//returns a unique/specific listing from the listings collection
router.get('/getList/:listingId', getListing)

//create a new listing to the listings collection, returns the newly created listing obj
router.post('/create', verifyToken, createListing)

//edit a specific existing listing, return the editted/updated listing obj
router.post('/edit/:listingId', verifyToken, editListing)

//create a new review to the reviews collection of a specific listing, & add the review to the listing.reviews array. returns an array of 2 objs. [{Listing obj with the newly created review added}, {newly created review obj}]
router.post('/getList/:listingId/createReview', verifyToken, createReview)

//update/edit the review obj in the reviews collection, and returns an array of 2 objs. [{Listing obj with the review updated}, {newly updated review obj that was updated}]
router.post('/getList/:listingId/getReview/:reviewId/editReview', verifyToken, editReview)

//delete a specific listing from the listings collection & returns the listing obj that was deleted. returns the review obj that was deleted.
router.delete('/delete/:listingId', verifyToken, deleteListing)

//delete a specific review from the listings.reviews array and the reviews collection. returns the review obj that was deleted.
router.delete('/getList/:listingId/deleteReview/:reviewId', verifyToken, deleteReview)

export default router