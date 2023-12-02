import express from 'express'
import {test, updateUser, deleteUser, getUserListing, getUser} from '../controllers/user.controllers.js'
import { verifyToken } from '../utils/verifyUser.js'
const router = express.Router()

router.get('/test', test)

router.get('/:userId', verifyToken, getUser)

router.get('/listings/:userId', verifyToken, getUserListing)

router.post('/update/:userId', verifyToken ,updateUser)

router.delete('/delete/:userId', verifyToken, deleteUser)






export default router