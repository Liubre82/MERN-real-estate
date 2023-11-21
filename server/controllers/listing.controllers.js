import Listing from '../models/listing.model.js'


export const createListing = async (req, res, next) => {
    try {
        //create a new document and insert it into the database in one step, .save() is not needed
        const listing = await Listing.create(req.body)
        //const listing = new Listing(req.body)
        return  res.status(201).json(listing)
    } catch (err) {
        next(err)
    }
}