import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import { errorHandler } from '../utils/error.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

export const signUp = async (req, res, next) => {
    const { username, email, password } = req.body
    const hashedPassword = bcrypt.hashSync(password, 10) //Auto-gen a salt and hashes the pw
    const newUser = new User({ username, email, password: hashedPassword })
    try {
        await newUser.save()
        res.status(201).json('User created successfully')
    } catch(err) {
        next(err) //pass the err obj to the next middleware, which will be the errorHandling middleware
    }
}

export const signIn = async (req, res, next) => {
    
    const { username, password } = req.body
    try {
        const user = await User.findOne({username})
        //never specify which credential is wrong for security reason. because that will give the users hints that a username or password they inputted exist. 
        if(!user) return next(errorHandler(404, 'Wrong username or password!'))
        const passwordCheck = bcrypt.compareSync(password, user.password)
        if(!passwordCheck) return next(errorHandler(401, 'Wrong username or password!'))
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        //destructure the user obj, extract the password property from the obj, then use the rest parameter which creates a new obj of all the rest of the properties that were not extracted. so password in this instance will not be in the new otherDetails obj 
        //https://www.digitalocean.com/community/tutorials/understanding-destructuring-rest-parameters-and-spread-syntax-in-javascript#spread
        const {password: pass, ...otherDetails} = user._doc;
        res.cookie('access_token', token, { httpOnly: true}).status(200).json(otherDetails) //session
    } catch(err) {
        next(err)
    }

}