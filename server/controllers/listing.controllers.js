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