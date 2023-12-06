import mongoose from 'mongoose'

import Review from '../models/review.model.js'
import listings from './Listings.js'
import Listing from '../models/listing.model.js'
import dotenv from 'dotenv'
dotenv.config()

mongoose.connect(process.env.mongodbConnect).then(() => {
    console.log('Connected to MongoDB')
})
.catch(err => {
    console.log(err)
})

const seedDb = async () => {
    await Listing.deleteMany({})
    await Review.deleteMany({})
    for(let i = 0; i < listings.length;i++ ) {
        const listing = new Listing(listings[i])
        await listing.save()
    }

}


seedDb().then((data) => {
    console.log("Initial Listings added!"), 
    mongoose.connection.close();
})