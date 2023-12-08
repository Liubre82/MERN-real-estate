import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRouter from './routes/user.routes.js'
import authRouter from './routes/auth.routes.js'
import listingRouter from './routes/listing.routes.js'
import reviewRouter from './routes/review.routes.js'
import cookieParser from 'cookie-parser'
dotenv.config()

const app = express()

//allows json as the input to the server
app.use(express.json())
app.use(cookieParser())


mongoose.connect(process.env.mongodbConnect).then(() => {
    console.log('Connected to MongoDB')
})
.catch(err => {
    console.log(err)
})

//api routes
app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/listing', listingRouter)
//app.use('/api/review', reviewRouter)

app.use(express.static(path.join(__dirname, '/client/dist')))

//if route is not any of our api routes, it will run our index.html file which is the frontend pages
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client', 'dist', 'index.html'))
})

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal Server Error"
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})

app.listen(3000, () => {
    console.log("Server running on port 3000....")
})