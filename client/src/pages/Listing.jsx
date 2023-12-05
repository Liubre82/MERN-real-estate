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
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
  FaEdit
} from 'react-icons/fa';
import { MdDeleteForever } from "react-icons/md";
import { useSelector } from 'react-redux'
import { useNavigate } from "react-router-dom";
import { Rating } from 'react-simple-star-rating'
import Contact from '../components/Contact.jsx'

export default function Listing() {

  SwiperCore.use([Navigation])
  const params = useParams()
  const navigate = useNavigate();
  //stores fetched listing based on the listingId from url
  const [listing, setListing] = useState(null)
  //stores all the listing reviews in the reviews state
  const [reviews, setReviews] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [contact, setContact] = useState(false)
  const [copied, setCopied] = useState(false);
  const currentUser = useSelector(state => state.user)
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
  const [writeReview, setWriteReview] = useState(false)
  const [formData, setFormData] = useState({
    rating: 0,
    description: '',
    title: ''
  })

  const fetchListing = async () => {
    try {
      setFormData({
        rating: 0,
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
      setLoading(false)
      setError(false)
    } catch (err) {
      setError(true)
      setLoading(false)
    }

  }
  //console.log(listing.userRef._id)
  useEffect(() => {
    fetchListing(listing)
  }, [params.listingId]) //[]indicates useEffect will run only once, and the data inside means everytime there is a change in the params.listingId in the url, run the useEffect

  // Change star-ratingvalue
  const handleRating = (rate) => {
    setFormData({ ...formData, rating: rate })
  }

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
      const res = await fetch(`/api/listing/getList/${listing._id}/createReview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      setWriteReview(false)
      setReviews(data.reviews)
      console.log(data)
      console.log(data.reviews)

    } catch (err) {
      console.log(err)
    }

  }

  const handleReviewDelete = async (reviewId) => {
    try {
      const res = await fetch(`/api/listing/getList/${listing._id}/deleteReview/${reviewId}`, { method: 'DELETE' })
      const data = await res.json()
      console.log(data)
      setReviews((prev) => prev.filter(review => review._id !== reviewId))

    } catch(err) {
      console.log(err)
    }
  }

  console.log(reviews)

  return (

    <main className='mt-10'>
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && <p className='text-center my-5 text-2xl'>Something Went Wrong</p>}

      {listing && !loading && !error &&
        <div>
          {/* navigation allows user to 'slide between the images with arrow buttons */}
          {/* Swiper tag is the images section, displays user uploaded images */}
          <Swiper navigation className='max-w-3xl md:max-w-6xl'>
            {listing.imageUrls.map((imgUrl) => {
              return <SwiperSlide key={uuidv4()}>
                <div className='h-[500px] md:h-[550px]' style={{ background: `url(${imgUrl}) center no-repeat`, backgroundSize: 'cover' }}>

                </div>
              </SwiperSlide>
            })}
          </Swiper>
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

          {/* info section, section below the image */}
          <div className='flex flex-col lg:flex-row max-w-6xl mx-auto mt-5 '>
            {/* listing info section*/}
            <section className='flex flex-col max-w-3xl lg:max-w-2xl gap-4 p-3'>
              <div>
                <p className='text-2xl font-semibold'>
                  {listing.name} - ${' '}
                  {listing.offer
                    ? (+listing.regularPrice - +listing.discountPrice).toLocaleString('en-US')
                    : listing.regularPrice.toLocaleString('en-US')}
                  {listing.type === 'rent' && ' / month'}
                </p>
                <div className='flex items-center mt-6 gap-10'>
                  <p className='font-semibold'>
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
                        <button onClick={() => setContact(true)} className='mt-5 bg-slate-700 text-white p-3 rounded-lg uppercase font-medium hover:opacity-90 hover:underline '>Contact Landlord</button>
                        :
                        <Contact listing={listing} />
                    )
                    :
                    <button onClick={() => navigate(`/edit-listing/${listing._id}`)} className='mt-5 bg-green-700 text-white p-3 rounded-lg uppercase font-medium hover:opacity-90 hover:underline '>Edit Your Listing</button>
                ) : null
              }
            </section>

            {/* review section  */}
            <section className='p-3 flex flex-col gap-3 max-w-3xl lg:max-w-2xl lg:w-5/12'>
              <button className='font-mono font-semibold text-white bg-orange-600 p-3 rounded-lg hover:underline hover:opacity-80' onClick={() => setWriteReview(!writeReview)}>Write a review</button>

              {writeReview &&
                <form className='flex flex-col gap-3 ' onSubmit={handleSubmit}>
                  <div className='flex justify-between'>
                    <Rating onClick={handleRating} SVGclassName={'inline-block'}
                      allowFraction={true} SVGstorkeWidth={1}
                      SVGstrokeColor={'#f1a545'} transition={true} />
                    <button className='p-3 bg-orange-600 rounded-lg text-white font-semibold hover:underline hover:opacity-80'>Submit Review</button>
                  </div>
                  <input type="text" id='title' placeholder='write review title...' className=' p-3 rounded-lg' maxLength={60} required onChange={handleChange} value={formData.title} />
                  <textarea id="description" cols="50" rows="2" placeholder='write your review here....' className='p-3 rounded-md' required onChange={handleChange} value={formData.description}></textarea>
                </form>

              }
              {reviews.length === 0 && <p className='font-mono text-xl'>No reviews</p>}

              {/* div that displays all the reviews written for this listing. */}
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
                        <Rating SVGclassName={'inline-block'} readonly={true} initialValue={4.5} allowFraction={true} size={20} SVGstrokeColor={'#f1a545'} SVGstorkeWidth={1} />
                        <p>{review.title}</p>
                      </div>
                      <div>
                        <p>{review.description}</p>
                      </div>
                    </div>

                    {/*edit & delete button section */}
                    {review.author._id === currentUser.currentUser._id &&                     
                      <div className='flex items-center gap-5 mt-1'>
                        <button className='flex gap-1 items-center bg-blue-400 text-white p-1 rounded-lg w-20 justify-center hover:underline'><span className=''><FaEdit /></span>edit</button>
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
