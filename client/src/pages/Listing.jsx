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

export default function Listing() {

  SwiperCore.use([Navigation])
  const params = useParams()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

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
    fetchListing()
  }, [params.listingId]) //[]indiciates useEffect will run only once, and the data inside means everytime there is a change in the params.listingId in the url, run the useEffect


  return (

    <main className=''>
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && <p className='text-center my-5 text-2xl'>Something Went Wrong</p>}

      {listing && !loading && !error &&
        <div>
          {/* navigation allows user to 'slide between the images with arrow buttons */}
          {/* Swiper tag is the images section, displays user uploaded images */}
          <Swiper navigation>
            {listing.imageUrls.map((imgUrl, index) => {
              return <SwiperSlide key={uuidv4()}>
                <div className='h-[550px]' style={{ background: `url(${imgUrl}) center no-repeat`, backgroundSize: 'cover' }}>

                </div>
              </SwiperSlide>
            })}
          </Swiper>
          <section className='flex flex-col max-w-3xl mx-auto gap-3 p-3 mt-5'>
            <div>
              <p className='text-2xl font-semibold'>
                {listing.name} - ${' '}
                {listing.offer
                  ? listing.discountPrice.toLocaleString('en-US')
                  : listing.regularPrice.toLocaleString('en-US')}
                {listing.type === 'rent' && ' / month'}
              </p>
              <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
                <FaMapMarkerAlt className='text-green-700' />
                {listing.address}
              </p>
              <div className='flex gap-4 my-5'>
                <p className='bg-red-800 p-2 rounded-lg text-white self-start w-40 text-center'>
                  {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                </p>
                {listing.offer && (
                  <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-2 rounded-md'>
                    ${+listing.regularPrice - +listing.discountPrice} OFF
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
                <FaBed className='text-lg'/>
                {listing.bedrooms}
                {listing.bedrooms > 1 ? ' Beds' : ' Bed'}
              </li>
              <li className='flex gap-1 items-center'>
              <FaBath className='text-lg'/>
                {listing.bathrooms}
                {listing.bathrooms > 1 ? ' Bathrooms' : ' Bathroom'}
              </li>
              <li className='flex gap-1 items-center'>
                {/* {listing.parking ?} */}
                <FaParking/>
                {listing.parking ? 'Parking Spot' : 'No Parking'}
                
              </li>
              <li className='flex gap-1 items-center'>
                <FaChair/>
                {listing.furnished ? 'Furnished' : 'Not Furnished'}
              </li>
            </ul>
          </section>
        </div>



      }
    </main >
  )
}
