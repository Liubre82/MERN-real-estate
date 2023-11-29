import Listing from '../models/listing.model.js'
import { errorHandler } from '../utils/error.js'


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

export const deleteListing = async (req, res, next) => {
    const { listingId } = req.params
    const findListing = await Listing.findById(listingId)

    if (!findListing) {
        return next(errorHandler(404, 'Listing is not found.'))
    }
    if (req.user.id !== findListing.userRef) {
        return next(errorHandler(401, 'You can only delete your own listings!'))
    }
    try {
        await Listing.findByIdAndDelete(listingId)
        return res.status(200).json('Listing has been deleted!')
    } catch (err) {
        next(err)
    }
}

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
    if (req.user.id !== findListing.userRef) {
        return next(errorHandler(401, 'You can only update your own listings!'));
    }
};

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

export const getSearchListings = async (req, res, next) => {
    //The $in operator selects the documents where the value of a field equals any value in the specified array.
    try {
        const limit = parseInt(req.query.limit) || 9
        const startIndex = parseInt(req.query.startIndex) || 0

        let offer = req.query.offer
        if(offer === undefined || offer === 'false') {
            offer = { $in: [false, true] }
        }

        let furnished = req.query.furnished
        if(furnished === undefined || offer === 'false') {
            furnished = { $in: [false, true] }
        }

        let parking = req.query.parking
        if(parking === undefined || parking === 'false') {
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

        res.status(200).json(listings)
    } catch(err) {
        next(err)
    }
}