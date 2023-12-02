import { useSelector } from 'react-redux'
import { useRef, useState, useEffect } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserStart, signOutUserSuccess, signOutUserFailure } from '../redux/user/userSlice'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

export default function Profile() {
  const { currentUser, error } = useSelector((state) => state.user)
  const fileRef = useRef(null)
  const [file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [formData, setFormData] = useState({})
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [showListingError, setShowListingError] = useState(false)
  const [userListings, setUserListings] = useState([])

  const [showListing, setShowListing] = useState(false)

  const profileImg = currentUser.accountImage
  const dispatch = useDispatch()
  //firebase storage
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 && 
  // request.resource.contentType.matches('images/.*')

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  //uploads a single image to change the profile pic of current user
  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, accountImage: downloadURL })
        );
      }
    );
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      dispatch(updateUserStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (data.success === false) {
        dispatch(updateUserFailure(data.message))
        return
      }
      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true)
    } catch (err) {

      dispatch(updateUserFailure(err.message))
    }

  }

  const handleDeleteUser = async (event) => {
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE'
      })
      const data = res.json()
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message))
        return
      }
      dispatch(deleteUserSuccess(data))
    } catch (err) {
      dispatch(deleteUserFailure(err.message))
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart())
      const res = await fetch('/api/auth/signout')
      const data = await res.json()
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message))
        return
      }
      dispatch(signOutUserSuccess(data))
    } catch (err) {
      dispatch(signOutUserFailure(err.message))
    }
  }

  //sends a get request to api n retrieves all the listings created by the current logged in user and stores it in userListings state
  const handleUserListings = async () => {
    try {
      setShowListingError(false)
      const res = await fetch(`/api/user/listings/${currentUser._id}`)
      const data = await res.json()
      if (data.success === false) {
        setShowListingError(true)
        return
      }
      //store the returned array from fetch of all the user listings fetched from the api into the userListings state so we can access it in our jsx.
      setUserListings(data)
    } catch (err) {
      setShowListingError(true)
    }
  }

  //negate showListing boolean on every click to toggle, this will allow us to toggle display the UserListings 'component'
  const toggleShowListings = () => {
    setShowListing(prev => !prev);
    handleUserListings()
  }

  const handleDeleteListing = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, { method: 'DELETE' })
      const data = res.json()
      if (data.success === false) {
        return console.log(data)
      }
      setUserListings((prev) => prev.filter(listing => listing._id !== listingId))
    } catch (err) {
      console.log(err)
    }

  }

  return (
    <div className='max-w-lg m-auto p-3'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>

      <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
        <input onChange={(event) => setFile(event.target.files[0])} type="file" ref={fileRef} hidden />

        <img onClick={() => fileRef.current.click()} className='rounded-full h-24 w-24 object-cover self-center mt-2' src={formData.accountImage || profileImg} alt="Profile Image" />
        <p>
          {fileUploadError ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>

        <input className='border rounded-lg p-3 ' type="text" name='username' id='username' placeholder='username' defaultValue={currentUser.username} onChange={handleChange} />

        <input className='border rounded-lg p-3 ' type="email" name='email' id='email' placeholder='email' defaultValue={currentUser.email} onChange={handleChange} />

        <input className='border rounded-lg p-3 ' type="password" name='password' id='password' placeholder='password' onChange={handleChange} />

        <button className='bg-slate-700 text-white rounded-lg p-3 hover:opacity-90 disabled:opacity-70'>Update</button>
        <Link to={'/create-listing'} className='bg-green-700 text-white rounded-lg p-3 hover:opacity-90 disabled:opacity-70 text-center'>
          Create Listing
        </Link>
      </form>

      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-600 hover:underline cursor-pointer'>Delete Account</span>
        <span onClick={handleSignOut} className='text-red-600 hover:underline cursor-pointer'>Sign Out</span>
      </div>
      <p className='text-red-600 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>{updateSuccess ? 'User is updated successfully!' : ''}</p>
      <button onClick={toggleShowListings} className='text-green-700 text-lg font-bold w-full'>Show Listings</button>
      <p className='text-red-700 mt-5'>
        {showListingError ? 'Error showing listings' : ''}
      </p>

      { //Show user Listings section, toggles depending on showListing boolean state
        showListing && userListings.length > 0 &&
        <div className='mt-10'>
          <h1 className='text-2xl font-bold text-center'>{currentUser.username} Listings</h1>
          {userListings && userListings.length > 0 && userListings.map(listing => (
            <div key={listing._id} className='border border-slate-400 p-3 flex justify-between items-center my-5 rounded-lg'>
              <Link to={`/listing/${listing._id}`}>
                <section className='flex flex-grow-1 items-center gap-3 font-mono hover:underline'>
                  <img src={listing.imageUrls[0]} alt="listing Thumbnail" className='w-20 h-20 object-cover' />
                  <p className='text-lg font-medium truncate'>{listing.name}</p>
                </section>
              </Link>
              <section className='flex flex-col flex-3 gap-1'>
                <button onClick={() => handleDeleteListing(listing._id)} className='text-red-700 font-semibold hover:underline p-1 rounded border-red-700 hover:border'>DELETE</button>
                <Link to={`/edit-listing/${listing._id}`}>
                  <button className='text-green-600 font-semibold hover:underline p-1 rounded border-green-600 hover:border'>EDIT</button>
                </Link>

              </section>
            </div>
          ))}
        </div>

      }
    </div>

  )
}
