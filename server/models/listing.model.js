import mongoose from 'mongoose'

const listingSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    regularPrice: {
        type: Number,
        required: true
    },
    discountPrice: {
        type: Number,
        required: true
    },
    bathrooms: {
        type: Number,
        required: true
    },
    bedrooms: {
        type: Number,
        required: true
    },
    furnished: {
        type: Boolean,
        required: true
    },
    parking: {
        type: Boolean,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    offer: {
        type: Boolean,
        required: true
    },
    imageUrls: {
        type: [],
        required: true
    },
    imageNames: {
        type: []
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    userRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true })


listingSchema.pre(['find', 'findOne'], function () {
    // `this` is an instance of mongoose.Query
    this.populate([
        {path:'userRef', select:'username email accountImage'}, 
        //sorts reviews array by most recently created review & populate the author field INSIDE the reviews array
        {path:'reviews', options: { sort: { updatedAt: -1 } }, populate: {path: 'author', select:'username email accountImage'}}, 
    ])
})

const Listing = mongoose.model('Listing', listingSchema)

export default Listing