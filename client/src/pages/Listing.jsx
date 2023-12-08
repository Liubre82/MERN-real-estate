import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules'
import 'swiper/css/bundle'
import { v4 as uuidv4 } from 'uuid';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
  FaEdit
} from 'react-icons/fa';
import { IoIosStar } from "react-icons/io";
import { MdDeleteForever } from "react-icons/md";
import { useSelector } from 'react-redux'
import { useNavigate } from "react-router-dom";
import { Rating } from 'react-simple-star-rating'
import Contact from '../components/Contact.jsx'
import { Virtual } from 'swiper/modules';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Listing() {

  /* unknown reason currentUser obj is like this. to access the user info, we need to do currentUser.currentUser 
  {currentUser: {…}, error: null, loading: false}
currentUser : 
{_id: '65603f653739a6fb33d25ea4', username: 'jiajin', email: 'jin@gmail.com', accountImage: 'https://i.stack.imgur.com/34AD2.jpg', createdAt: '2023-11-24T06:15:01.112Z', …}
error
: 
null
loading
: 
false
[[Prototype]]
: 
Object
  */
  const currentUser = useSelector(state => state.user)
  SwiperCore.use([Navigation])
  const params = useParams()
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [contact, setContact] = useState(false)
  const [copied, setCopied] = useState(false);
  const [writeReview, setWriteReview] = useState(false)
  const [editReview, setEditReview] = useState(false)

  //stores fetched listing based on the listingId from url
  const [listing, setListing] = useState(null)
  //stores all the listing reviews in the reviews state
  const [reviews, setReviews] = useState(null)
  const [currentUserReview, setCurrentUserReview] = useState(null)
  const [formData, setFormData] = useState({
    rating: 1,
    description: '',
    title: ''
  })
  const [editFormData, setEditFormData] = useState({})
  const [ratingAverage, setRatingAverage] = useState(null)

  //calculate the average rating of all the reviews for this particular listing.
  const getAverageRating = (arr) => {
    let sum = 0;
    if (arr.length === 0) {
      return 'No Rating'
    }
    for (let i = 0; i < arr.length; i++) {
      sum += arr[i].rating
    }

    const averageRating = (sum / arr.length).toFixed(2)
    return averageRating
  }

  //get the listing doc from the collection based on the listingId in the params
  const fetchListing = async () => {
    try {
      setFormData({
        rating: 1,
        description: '',
        title: ''
      })
      setLoading(true)
      const res = await fetch(`/api/listing/getList/${params.listingId}`)
      const data = await res.json()
      if (data.success === false) {
        setError(true)
        setLoading(false)
        return
      }
      setListing(data)
      setReviews(data.reviews)

      if (currentUser.currentUser) {
        //checks if user has a written a review or not.
        for (let i = 0; i < data.reviews.length; i++) {
          if (data.reviews[i].author._id === currentUser.currentUser._id) {
            setEditFormData(data.reviews[i])
            break
          }
        }
      }

      setRatingAverage(getAverageRating(data.reviews))
      setLoading(false)
      setError(false)
    } catch (err) {
      setError(true)
      setLoading(false)
    }

  }

  //checks to see if User has posted a review or not.
  const checkUserHasReview = (arr) => {
    for (let i = 0; i < arr.length; i++) {
      if (currentUser.currentUser._id === arr[i].author._id) {
        return true
      }
    }
    return false
  }

  //everytime there is a new listingId in the url, run the fetchListing function to retrieve 'that' listing
  useEffect(() => {
    fetchListing(listing)
  }, [params.listingId]) //[]indicates useEffect will run only once, and the data inside means everytime there is a change in the params.listingId in the url, run the useEffect

  // Change star-rating value for create review form
  const handleRating = (rate) => {
    setFormData({ ...formData, rating: rate })
  }

  // Change star-rating value for edit review form
  const handleEditRating = (rate) => {
    setEditFormData({ ...editFormData, rating: rate })
  }

  //change value of review form data on every change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  //posts a review to the reviews collection & adds it to the reviews array in this listing.
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      //returns an array of 2 objs, 1st obj is the updated Listing doc with the added review, & 2nd obj is the newly created review doc the user just submitted.
      const res = await fetch(`/api/listing/getList/${listing._id}/createReview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if(data.success === false) {
        toast.error("Unsuccessful, could not submit review!")
        return
      }
      toast.success("review sucessfuly created!")
      setWriteReview(false)
      setReviews(data[0].reviews)
      setListing(data[0])
      setRatingAverage(getAverageRating(data[0].reviews))
      setEditFormData(data[1])
      setFormData({
        rating: 1,
        description: '',
        title: ''
      })
    } catch (err) {
      console.log(err)
    }

  }

  //delete review from our states, listing and reviews collection
  const handleReviewDelete = async (reviewId) => {
    try {
      const res = await fetch(`/api/listing/getList/${listing._id}/deleteReview/${reviewId}`, { method: 'DELETE' })
      const data = await res.json()
      setEditReview(false)
      setRatingAverage(getAverageRating(data.reviews))
      setReviews((prev) => prev.filter(review => review._id !== reviewId))
    } catch (err) {
      console.log(err)
    }
  }

  //change value of edit review form data on every change
  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.id]: e.target.value
    })
  }

  //update users review.
  const handleEditSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/listing/getList/${listing._id}/getReview/${editFormData._id}/editReview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editFormData)
      })
      const data = await res.json()
      if(data.success === false) {
        toast.error("Unsuccessful, could not edit review!")
        return
      }
      toast.success("review updated!")
      setReviews(data[0].reviews)
      setRatingAverage(getAverageRating(data[0].reviews))
      setEditReview(false)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <main className='mt-10'>
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
      />
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && <p className='text-center my-5 text-2xl'>Something Went Wrong</p>}

      {listing && !loading && !error &&
        <div className='max-w-3xl mx-auto mt-5 lg:max-w-6xl'>

          {/* navigation allows user to 'slide between the images with arrow buttons 
          - Swiper tag is the images section, displays user uploaded images 
          */}
          <div className='max-w-3xl md:max-w-5xl mx-atuo flex items-center'>
            <Swiper navigation modules={[Virtual]}>
              {listing.imageUrls.map((imgUrl) => {
                return <SwiperSlide key={uuidv4()} >
                  <div className='h-auto'>
                    <img src={imgUrl} alt={imgUrl} className='max-w-5xl w-full object-fill lg:object-cover' />
                  </div>
                </SwiperSlide>
              })}
            </Swiper>
          </div>

          {/* A clickable icon that copies the current pages url. */}
          <div>
            <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}>
              <FaShare className='text-slate-500' />
            </div>
            {copied && (
              <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
                Link copied!
              </p>
            )}
          </div>


          {/* listing info & reviews section, the section below the image */}
          <div className='flex flex-col lg:flex-row  max-w-3xl mx-auto mt-5 lg:max-w-6xl'>

            {/* listing info section*/}
            <section className='flex flex-col max-w-3xl lg:max-w-2xl gap-4 p-3 lg:w-4/6'>
              <div>
                <p className='text-2xl font-semibold'>
                  {listing.name} - ${' '}
                  {listing.offer
                    ? (+listing.regularPrice - +listing.discountPrice).toLocaleString('en-US')
                    : listing.regularPrice.toLocaleString('en-US')}
                  {listing.type === 'rent' && ' / month'}
                </p>
                <div className='flex items-center mt-6 gap-10'>
                  <p className='font-semibold flex gap-2 items-center text-lg'>
                    <img className='rounded-full h-12 w-12 object-cover self-center mt-2' src={listing.userRef.accountImage} alt="Profile Image" />
                    Posted By: {listing.userRef.username}
                  </p>
                  <p className='flex items-center gap-2 text-slate-600 text-sm'>
                    <FaMapMarkerAlt className='text-green-700' />
                    {listing.address}
                  </p>
                </div>

                <div className='flex gap-4 my-5'>
                  <p className='bg-red-800 p-2 rounded-lg text-white self-start w-40 text-center'>
                    {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                  </p>
                  {listing.offer && (
                    <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-2 rounded-md'>
                      ${listing.discountPrice.toLocaleString('en-US')} OFF
                    </p>
                  )}
                </div>
              </div>
              <p className='text-slate-800 break-words'>
                <span className='font-semibold text-black'>Description - </span>
                {listing.description}
              </p>
              <ul className='flex gap-10 flex-wrap font-medium'>
                <li className='flex gap-1 items-center'>
                  <FaBed className='text-lg' />
                  {listing.bedrooms}
                  {listing.bedrooms > 1 ? ' Beds' : ' Bed'}
                </li>
                <li className='flex gap-1 items-center'>
                  <FaBath className='text-lg' />
                  {listing.bathrooms}
                  {listing.bathrooms > 1 ? ' Bathrooms' : ' Bathroom'}
                </li>
                <li className='flex gap-1 items-center'>
                  {/* {listing.parking ?} */}
                  <FaParking />
                  {listing.parking ? 'Parking Spot' : 'No Parking'}

                </li>
                <li className='flex gap-1 items-center'>
                  <FaChair />
                  {listing.furnished ? 'Furnished' : 'Not Furnished'}
                </li>
              </ul>

              {/* checks if user is logged in, if not, no button options will be displayed.
                if user is logged in, new terminal operator will determine which button to        display. */}
              {currentUser.currentUser ?
                (
                  //if user is logged in and the listing belongs to the logged user, display edit button, else display contact user button.
                  (listing.userRef._id !== currentUser.currentUser._id) ?
                    (
                      !contact ?
                        <button onClick={() => setContact(true)} className='mt-5 bg-slate-700 text-white p-3 rounded-lg font-medium hover:opacity-90 hover:underline '>Contact Landlord</button>
                        :
                        <Contact listing={listing} />
                    )
                    :
                    <button onClick={() => navigate(`/edit-listing/${listing._id}`)} className='mt-5 bg-green-700 text-white p-3 rounded-lg font-medium hover:opacity-90 hover:underline '>Edit Your Listing</button>
                ) : null
              }
            </section>

            {/* reviews section  */}
            <section className='p-3 flex flex-col gap-3 max-w-3xl lg:max-w-2xl lg:w-2/6 my-10'>

              {/* only allow a logged in user, & a user that did not post the listing to write a review otherwise dont display button aka cant post review */}
              {currentUser.currentUser && currentUser.currentUser._id !== listing.userRef._id && !checkUserHasReview(reviews) && <button className='font-mono font-semibold text-white bg-orange-600 p-3 rounded-lg hover:underline hover:opacity-80' onClick={() => setWriteReview(!writeReview)}>Write a review</button>}

              {/* create review form section */}
              {writeReview &&
                <form className='flex flex-col gap-3 ' onSubmit={handleSubmit}>
                  <div className='flex justify-between'>
                    <Rating onClick={handleRating} SVGclassName={'inline-block'}
                      allowFraction={true} SVGstorkeWidth={1} initialValue={formData.rating}
                      SVGstrokeColor={'#f1a545'} transition={true} />
                    <button className='p-3 bg-orange-600 rounded-lg text-white font-semibold hover:underline hover:opacity-80' >Submit Review</button>
                  </div>
                  <input type="text" id='title' placeholder='write review title...' className=' p-3 rounded-lg' maxLength={60} required onChange={handleChange} value={formData.title} />
                  <textarea id="description" cols="50" rows="2" placeholder='write your review here....' className='p-3 rounded-md' required onChange={handleChange} value={formData.description}></textarea>
                </form>
              }

              {/* only allow a logged in user to write a review otherwise dont display button */}
              {currentUser.currentUser && checkUserHasReview(reviews) && <button className='font-mono font-semibold text-white bg-orange-600 p-3 rounded-lg hover:underline hover:opacity-80' onClick={() => setEditReview(!editReview)}>Edit Your Review</button>}

              {/* create review form section */}
              {editReview &&
                <form className='flex flex-col gap-3' onSubmit={handleEditSubmit} >
                  <div className='flex justify-between'>
                    <Rating onClick={handleEditRating} SVGclassName={'inline-block'}
                      allowFraction={true} SVGstorkeWidth={1} initialValue={editFormData.rating}
                      SVGstrokeColor={'#f1a545'} transition={true} />
                    <button className='p-3 bg-orange-600 rounded-lg text-white font-semibold hover:underline hover:opacity-80'>Update Review</button>
                  </div>
                  <input type="text" id='title' placeholder='write review title...' className=' p-3 rounded-lg' maxLength={60} required onChange={handleEditChange} value={editFormData.title} />
                  <textarea id="description" cols="50" rows="2" placeholder='write your review here....' className='p-3 rounded-md' required onChange={handleEditChange} value={editFormData.description}></textarea>
                </form>
              }

              {/* reviews Header text section */}
              <div className='flex gap-5 items-center lg:justify-between'>
                {reviews.length === 0 ? <p className='font-mono text-xl text-center'>No reviews</p> : <p className='font-mono text-2xl p-3 font-bold'>User Reviews</p>}
                {<div className='text-xl flex gap-1 items-center text-orange-500 font-bold'><IoIosStar /> {ratingAverage}</div>}
              </div>

              {/* div that displays all the reviews posted on this listing. */}
              <div className='max-h-96 overflow-auto'>
                {reviews.map(review => (
                  <div className='flex flex-col justify-center p-3' key={review._id}>
                    {/* review text information display section */}
                    <div>
                      <div className='flex gap-3 items-center lg:justify-between'>
                        <div className='flex gap-3 items-center'>
                          <img className='rounded-full h-8 w-8 object-cover self-center mt-2' src={review.author.accountImage} alt="Profile Image" />
                          <p className='font-semibold font-mono text-slate-600'>{review.author.username}</p>
                        </div>
                        {new Date(review.updatedAt).toLocaleString('en-US', { timeZone: 'America/New_York' })}
                      </div>
                      <div className='flex gap-3 items-center font-semibold font-mono'>
                        <Rating SVGclassName={'inline-block'} readonly={true} initialValue={review.rating} allowFraction={true} size={20} SVGstrokeColor={'#f1a545'} SVGstorkeWidth={1} />
                        <p>{review.title}</p>
                      </div>
                      <div>
                        <p>{review.description}</p>
                      </div>
                    </div>

                    {/*edit & delete button section */}
                    {currentUser.currentUser && review.author._id === currentUser.currentUser._id &&
                      <div className='flex items-center gap-5 mt-2'>
                        <button className='flex gap-1 items-center text-white bg-red-600 p-1 rounded-lg w-20 justify-center hover:underline' onClick={() => handleReviewDelete(review._id)}><span className='text-lg'><MdDeleteForever /></span>delete</button>
                      </div>
                    }

                  </div>

                ))}
              </div>

            </section>
          </div>

        </div>
      }
    </main >
  )
}
