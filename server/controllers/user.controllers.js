import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs'

export const test = (req, res) => {
    res.json(
        { message: "This is a test" }
    )
}

export const updateUser = async (req, res, next) => {
    const { id } = req.params
    const { username, email, accountImage } = req.body
    //req.user was a property that was passed into the req obj from the previous middleware, verifyUToken
    if (req.user.id !== id) return next(errorHandler(401, "You can only update your own account!"))
    try {
        //hash the new password IF the user inputted a new password to be updated
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10)
        }

        //find the user from the model with the id, and set every property to the 
        const updateUser = await User.findByIdAndUpdate(id, {
            //$set operator will check for us if the input was changed, if there was no change. for ex: if the user did not input anything in the email inputbox, then $set will ignore that input and it retains its original value. 
            //always specify each indvidual property, passing req.body can cause security issues where users can add their own properties like say in a api tester and just pass fields  that are technically not allowed but since its in the req.body it will get passed in.
            $set: {
                username, email, password: req.body.password, accountImage
            }
        }, {new: true})

        const {password, ...otherDetails} = updateUser._doc;
        res.status(200).json(otherDetails)
    } catch (err) {
        next(err)
    }
}

export const deleteUser = async (req, res, next) => {
    const { id } = req.params
    //req.user is a property that was added to the req obj in the previous middleware. and it stores info on the current user that is logged in.
    if(req.user.id !== id) return next(errorHandler(401, 'You can only delete your own account!'))
    try {
        const user = await User.findByIdAndDelete(id)
        res.clearCookie('access_token')
        res.status(200).json('User has been deleted...')
    } catch (err) {
        next(err)
    }
}