import express from 'express'
const router = express.Router()
import {signUp, signIn, signInGoogle} from '../controllers/auth.controllers.js'

router.post('/signup', signUp)

router.post('/signin', signIn)

router.post('/google', signInGoogle)

export default router