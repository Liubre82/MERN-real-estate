import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        min: 3
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, {timestamps: true}) //when user schema is called, the time of a user obj creation or update, it records the time of when it happened.

const User = mongoose.model("User", userSchema)

export default User