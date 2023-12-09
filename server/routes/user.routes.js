import express from 'express'
import {test, updateUser, deleteUser, getUserListing, getUser, deleteUserListings} from '../controllers/user.controllers.js'
import { verifyToken } from '../utils/verifyUser.js'
const router = express.Router()

router.get('/test', test)

//returns the specified user obj WITHOUT the password property.
router.get('/:userId', verifyToken, getUser)

//returns an arr of all the listing objs created by the user
router.get('/:userId/listings', verifyToken, getUserListing)

//returns an array confirming listings has been deleted.
router.delete('/:userId/listings', verifyToken, deleteUserListings)

//returns the updated user obj without the password.
router.post('/:userId', verifyToken ,updateUser)

//returns a confirmation string that the user has been deleted
router.delete('/:userId', verifyToken, deleteUser)






export default router