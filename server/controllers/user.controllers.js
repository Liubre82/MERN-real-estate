import User from "../models/user.model.js"
import Listing from '../models/listing.model.js'
import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs'

export const test = (req, res) => {
    res.json(
        { message: "This is a test" }
    )
}

//update the users obj, and returns the user obj without the password.
export const updateUser = async (req, res, next) => {
    const { userId } = req.params
    const { username, email, accountImage } = req.body
    //req.user was a property that was passed into the req obj from the previous middleware, verifyUToken
    if (req.user.id !== userId) return next(errorHandler(401, "You can only update your own account!"))
    try {
        //hash the new password IF the user inputted a new password to be updated
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10)
        }

        //find the user from the model with the id, and set every property to the 
        const updateUser = await User.findByIdAndUpdate(userId, {
            //$set operator will check for us if the input was changed, if there was no change. for ex: if the user did not input anything in the email inputbox, then $set will ignore that input and it retains its original value. 
            //always specify each indvidual property, passing req.body can cause security issues where users can add their own properties like say in a api tester and just pass fields  that are technically not allowed but since its in the req.body it will get passed in.
            $set: {
                username, email, password: req.body.password, accountImage
            }
        }, { new: true })

        //destructure the updateUser obj, otherDetails has all the keys in updateUser EXCEPT password because it has been destructured beforehand, and any key specified before the spread operator in destructuring will not be added in. so otherDetails does not have the password key.
        const { password, ...otherDetails } = updateUser._doc;
        res.status(200).json(otherDetails)
    } catch (err) {
        next(err)
    }
}

//delete the user obj from the collection & log the user out.
export const deleteUser = async (req, res, next) => {
    const { userId } = req.params
    //req.user is a property that was added to the req obj in the previous middleware. and it stores info on the current user that is logged in.
    if (req.user.id !== userId) return next(errorHandler(401, 'You can only delete your own account!'))
    try {
        const user = await User.findByIdAndDelete(userId)
        res.clearCookie('access_token')
        res.status(200).json('User has been deleted...')
    } catch (err) {
        next(err)
    }
}

//retrieve all the listings a user has posted to the listings colelction & returns an arr of all the listing objs by the user
export const getUserListing = async (req, res, next) => {
    const { userId } = req.params
    if (req.user.id === userId) {
        try {
            //every listing created has a userId attatch to it, indicating which user created the listing. to find all the listings of the current logged in user just search the Listing collection for the userId in the 'userRef' field
            const listings = await Listing.find({ userRef: userId })
            //sends an array of docs/objs of every listing the current user created.
            res.status(200).json(listings)
        } catch (err) {
            next(err)
        }
    } else {
        return next(errorHandler(401, 'You can only retrieve your own accounts listings!'))
    }
}

//delete all listings the user has created.
export const deleteUserListings = async(req, res, next) => {
    const { userId } = req.params
    if (req.user.id === userId) {
        try {
            const listings = await Listing.deleteMany({ userRef: userId })
            res.status(200).json(listings)
        } catch (err) {
            next(err)
        }
    } else {
        return next(errorHandler(401, 'You can only delete your own accounts listings!'))
    }
}

//returns the specified user obj WITHOUT the password property.
export const getUser = async(req, res, next) => {
    try {
        const { userId } = req.params
        const findUser = await User.findById(userId)
        if(!findUser) return next(errorHandler(404, 'User not found!'))
        //password is the key to destructure out of findUser, pass is the 'password'->value inside findUser
        const { password: pass, ...otherDetails } = findUser._doc;
        res.status(200).json(otherDetails)
    } catch(err) {
        next(err)
    }
}