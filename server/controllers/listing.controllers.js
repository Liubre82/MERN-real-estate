import Listing from '../models/listing.model.js'
import { errorHandler } from '../utils/error.js'
import Review from '../models/review.model.js'


//create a new listing to the listings collection, returns the newly created listing obj
export const createListing = async (req, res, next) => {
    try {
        //create a new document and insert it into the database in one step, .save() is not needed
        const listing = await Listing.create(req.body)
        //const listing = new Listing(req.body)
        //listing.save()
        return res.status(201).json(listing)
    } catch (err) {
        next(err)
    }
}

// for some odd reason insomnia does not run the error handler when the listing id cannot be found and it crashes our server when the id param in the url is not valid

//delete specified listing and returns the listing obj that was deleted.
export const deleteListing = async (req, res, next) => {
    const { listingId } = req.params
    const findListing = await Listing.findById(listingId)

    if (!findListing) {
        return next(errorHandler(404, 'Listing is not found.'))
    }
    if (JSON.stringify(req.user.id) !== JSON.stringify(findListing.userRef._id)) {
        return next(errorHandler(401, 'You can only delete your own listings!'))
    }
    try {
        const deletedListing = await Listing.findByIdAndDelete(listingId)
        return res.status(200).json(deletedListing)
    } catch (err) {
        next(err)
    }
}

//edit a specific existing listing, return the editted/updated listing obj
export const editListing = async (req, res, next) => {
    const { listingId } = req.params
    const findListing = await Listing.findById(listingId);
    if (findListing) {

        try {
            const updatedListing = await Listing.findByIdAndUpdate(
                listingId,
                req.body,
                { new: true }
            );
            res.status(200).json(updatedListing);
        } catch (error) {
            next(error);
        }
    } else {
        return next(errorHandler(404, 'Listing not found!'));
    } 
    if (JSON.stringify(req.user.id) !== JSON.stringify(findListing.userRef._id)) {
        return next(errorHandler(401, 'You can only update your own listings!'));
    }
};

//returns a unique/specific listing from the listings collection
export const getListing = async (req, res, next) => {
    try {
        const { listingId } = req.params
        const findListing = await Listing.findById(listingId)
        if(!findListing) {
            return next(errorHandler(404, 'cannot find listing'))
        }
        res.status(200).json(findListing)
    } catch (err) {
        next(err)
    }
}

//return listings based on the queryStrings/filtered listings
export const getSearchListings = async (req, res, next) => {
    //The $in operator selects the documents where the value of a field equals any value in the specified array.
    try {
        const limit = parseInt(req.query.limit) || 9
        const startIndex = parseInt(req.query.startIndex) || 0

        let offer = req.query.offer
        if(offer === undefined) {
            offer = { $in: [false, true] }
        }

        let furnished = req.query.furnished
        if(furnished === undefined) {
            furnished = { $in: [false, true] }
        }

        let parking = req.query.parking
        if(parking === undefined) {
            parking = { $in: [false, true] }
        }

        let type = req.query.type
        if(type === undefined || type === 'all') {
            type = { $in: ['sale', 'rent'] }
        }

        const searchTerm = req.query.searchTerm || ''
        const sort = req.query.sort || 'createdAt'
        const order = req.query.order || 'desc'

        const listings = await Listing.find({

            name: { $regex: searchTerm, $options: 'i'},
            offer, furnished, parking, type
        })
        .sort({[sort]: order})
        .limit(limit)
        .skip(startIndex)
        return res.status(200).json(listings)
    } catch(err) {
        next(err)
    }
}

//get all listings that were posted from all users.(retrieves entire listings collection) returns an array of all the listing objs
export const getAllListings = async (req, res, next) => {
    try {
        const allListings = await Listing.find({})
        res.status(200).json(allListings)

    } catch(err) {
        next(err)
    }
}

//create a new review to the reviews collection of a specific listing, & add the review to the listing.reviews array. returns an array of 2 objs. [{Listing obj with the newly created review added}, {newly created review obj}]
export const createReview = async (req, res, next) => {
    try {    
        const { listingId } = req.params  
        const findListing = await Listing.findById(listingId)
        if(!findListing) {
            return next(errorHandler(404, 'cannot find listing'))
        }              
        const review = new Review(req.body)
        review.author = req.user.id
        findListing.reviews.push(review)
        await review.save()
        await findListing.save()
        const updatedListing = await Listing.findById(listingId)
        return res.status(201).json([updatedListing, review])
    } catch(err) {
        next(err)
    }
}

//delete a specific review from the listings.reviews array and the reviews collection. returns the review obj that was deleted.
export const deleteReview = async (req, res, next) => {
    try {  
        const { listingId, reviewId } = req.params  
        const findListing = await Listing.findById(listingId)
        const findReview =  await Review.findById(reviewId)
        if (!findListing) {
            return next(errorHandler(404, 'Listing is not found.'))
        }
        if (!findReview) {
            return next(errorHandler(404, 'Review is not found.'))
        }
        if (JSON.stringify(req.user.id) !== JSON.stringify(findReview.author)) {
            return next(errorHandler(401, 'You can only delete your own reviews!'))
        } 
        const deleteReviewFromListing = await Listing.findByIdAndUpdate(listingId, { $pull: { reviews: reviewId}}, { new: true }).populate('reviews')
        const deleteReview = await Review.findByIdAndDelete(reviewId)
        res.status(200).json(deleteReviewFromListing)
    } catch(err) {
        next(err)
    }
}

//update/edit the review obj in the reviews collection, and returns an array of 2 objs. [{Listing obj with the review updated}, {newly updated review obj that was updated}]
export const editReview = async (req, res, next) => {
    try {
        const { listingId, reviewId } = req.params  
        const findListing = await Listing.findById(listingId)
        const findReview =  await Review.findById(reviewId)
        if (!findListing) {
            return next(errorHandler(404, 'Listing is not found.'))
        }
        if (!findReview) {
            return next(errorHandler(404, 'Review is not found.'))
        }
        if (JSON.stringify(req.user.id) !== JSON.stringify(findReview.author)) {
            return next(errorHandler(401, 'You can only delete your own reviews!'))
        } 
        const updateReview = await Review.findByIdAndUpdate(reviewId, req.body, { new: true })
        const updatedList = await Listing.findById(listingId)
        res.status(200).json([updatedList, updateReview]);
    } catch(err) {
        next(err)
    }
}
