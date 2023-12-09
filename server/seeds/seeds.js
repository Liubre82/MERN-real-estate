import mongoose from 'mongoose'
import Review from '../models/review.model.js'
import listings from './Listings.js'
import reviews from './reviews.js'
import Listing from '../models/listing.model.js'
import dotenv from 'dotenv'
import { reviewUsers } from './userIdParams.js'
dotenv.config()

/* Seeds file will CLEAR/DELETE your ENTIRE listings & reviews collection then store some static data to our db to have some initial data for our website, so we have something to display immediately rather than an empty website & having to manually create individual listings & reviews. 

for adding reviews, you must create your own user/s then specify the user ids as the createReviews args. look at createReviews() and how its used inside seedsDb() & see userIds array.
*/

mongoose.connect(process.env.mongodbConnect).then(() => {
    console.log('Connected to MongoDB')
})
    .catch(err => {
        console.log(err)
    })

//retrieves a random element from an array
const randomElement = arr => arr[Math.floor(Math.random() * arr.length)]


//shuffles an array randonly
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

shuffleArray(listings)
//creates a certain number of reviews based on how many unique authors are passed in as args. and saves it to the reviews collection. returns an array of reviews of length authorId
const createReviews = async (...authorId) => {
    const reviewsArr = []
    for(let i = 0; i < authorId.length; i++) {
        const review = new Review({...randomElement(reviews), author: authorId[i]})
        await review.save()
        reviewsArr.push(review)
    }
    return reviewsArr
}

//CLEARS our listing and reviews collection, THEN inserts inital data to our database so our website has data to use to display listings.
const seedDb = async () => {

    await Listing.deleteMany({})
    await Review.deleteMany({})

    for (let i = 0; i < listings.length; i++) {
        const reviews = await createReviews(...reviewUsers)
        shuffleArray(listings[i].imageUrls)
        const listing = new Listing({...listings[i], reviews})
        await listing.save()
    }
}

seedDb().then(() => {
    console.log("Initial Listings added!"),
        mongoose.connection.close();
})