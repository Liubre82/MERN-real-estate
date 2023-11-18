import express from 'express'
const router = express.Router()
import {signUp, signIn, signInGoogle, signOut} from '../controllers/auth.controllers.js'

router.post('/signup', signUp)

router.post('/signin', signIn)

router.post('/google', signInGoogle)

router.get('/signout', signOut)

export default router