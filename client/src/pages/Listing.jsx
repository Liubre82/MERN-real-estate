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
} from 'react-icons/fa';
import { useSelector } from 'react-redux'
import { useNavigate } from "react-router-dom";
import Contact from '../components/Contact.jsx'

export default function Listing() {

  SwiperCore.use([Navigation])
  const params = useParams()
  const navigate = useNavigate();
  const [listing, setListing] = useState(null)
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

  //console.log(listing.userRef._id)
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/listing/getList/${params.listingId}`)
        const data = await res.json()
        if (data.success === false) {
          setError(true)
          setLoading(false)
          return
        }
        setListing(data)
        setLoading(false)
        setError(false)
      } catch (err) {
        setError(true)
        setLoading(false)
      }

    }
    fetchListing(listing)
  }, [params.listingId]) //[]indicates useEffect will run only once, and the data inside means everytime there is a change in the params.listingId in the url, run the useEffect

  return (

    <main className='mt-10'>
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && <p className='text-center my-5 text-2xl'>Something Went Wrong</p>}

      {listing && !loading && !error &&
        <div>
          {/* navigation allows user to 'slide between the images with arrow buttons */}
          {/* Swiper tag is the images section, displays user uploaded images */}
          <Swiper navigation className='max-w-2xl md:max-w-5xl'>
            {listing.imageUrls.map((imgUrl) => {
              return <SwiperSlide key={uuidv4()}>
                <div className='h-[400px] md:h-[550px]' style={{ background: `url(${imgUrl}) center no-repeat`, backgroundSize: 'cover' }}>

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

          {/* section to display the listing info */}
          <section className='flex flex-col max-w-3xl mx-auto gap-4 p-3 mt-5'>
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
            <p className='text-slate-800'>
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

            {/* if listing belongs to the current logged in user, display button to route them to edit listing page, if not, display button to contact/email the user that created the listing. */}
            {(currentUser && (listing.userRef._id !== currentUser.currentUser._id)) ?
              (
                !contact ? <button onClick={() => setContact(true)} className='mt-5 bg-slate-700 text-white p-3 rounded-lg uppercase font-medium hover:opacity-90 hover:underline '>Contact Landlord</button>
                  :
                  <Contact listing={listing} />
              )
              :
              <button onClick={() => navigate(`/edit-listing/${listing._id}`)} className='mt-5 bg-green-700 text-white p-3 rounded-lg uppercase font-medium hover:opacity-90 hover:underline '>Edit Your Listing</button>}
          </section>
        </div>
      }

    </main >
  )
}
