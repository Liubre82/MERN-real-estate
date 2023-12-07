import express from 'express'
import {test, updateUser, deleteUser, getUserListing, getUser, deleteUserListings} from '../controllers/user.controllers.js'
import { verifyToken } from '../utils/verifyUser.js'
const router = express.Router()

router.get('/test', test)

//returns the specified user obj WITHOUT the password property.
router.get('/:userId', verifyToken, getUser)

//retrieve all the listings a user has posted to the listings colelction & returns an arr of all the listing objs by the user
router.get('/listings/:userId', verifyToken, getUserListing)

//delete all listings the user has created. returns an arr confirming listings has been deleted.
router.delete('/getUser/:userId/deleteListings', verifyToken, deleteUserListings)

//update the users obj, and returns the user obj without the password.
router.post('/update/:userId', verifyToken ,updateUser)

//delete the user obj from the collection & log the user out.
router.delete('/delete/:userId', verifyToken, deleteUser)






export default router