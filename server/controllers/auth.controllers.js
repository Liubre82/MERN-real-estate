import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'

export const signup = async (req, res) => {
    const { username, email, password } = req.body
    const hashedPassword = bcrypt.hashSync(password, 10) //Auto-gen a salt and hashes the pw
    const newUser = new User({ username, email, password: hashedPassword })
    try {
        await newUser.save()
        res.status(201).json('User created successfully')
    } catch(err) {
        //if the inputted username n email is duplicated, it will throw an error. err.message returns the msg created by express displaying what was the error.
        res.status(500).json(err.message)
    }

}