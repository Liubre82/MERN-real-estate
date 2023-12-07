import React from 'react'
import { Link } from 'react-router-dom'
import { MdLocationOn } from 'react-icons/md'
import { FaBath, FaBed } from 'react-icons/fa';
import { IoIosStar } from "react-icons/io";
import { useState } from 'react'

//calculate the average rating of all the reviews for this paticular listing.
export default function ListingCard({ listing }) {
  const discountedPrice = (listing.regularPrice - listing.discountPrice).toLocaleString('en-US')
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
  const [ratingAverage, setRatingAverage] = useState(getAverageRating(listing.reviews))

  return (
    <div className=' hover:scale-105 bg-white rounded-lg shadow-lg w-full sm:w-[320px]'>
      <Link to={`/listing/${listing._id}`}>

        {/* listing thumbnail & average rating section */}
        <div className='relative'>
          <img src={listing.imageUrls[0]} alt="Listing Thumbnail" className='relative h-[380px] sm:h-[220px] w-full object-cover rounded-t-lg' />
          <div className='absolute bg-slate-200 rounded-lg  top-2.5 right-2.5 px-1 flex gap-1 items-center text-orange-500 font-semibold'><IoIosStar /> {ratingAverage}</div>
        </div>

        {/* listing information section */}
        <div className='p-3'>
          <h1 className='text-xl truncate text-slate-700 font-bold mb-2'>{listing.name}</h1>
          <div className='flex gap-2 items-center mb-2'>
            <p className='font-semibold'>
              Posted By: {listing.userRef.username}
            </p>
            <p className='text-sm flex text-slate-500'><MdLocationOn className='h-4 w-4 text-green-700' /> {listing.address}</p>
          </div>

          <p className='line-clamp-2 text-sm'>{listing.description}</p>
          <p className='text-green-500 mt-3 font-semibold flex justify-between flex-wrap font-mono text-lg'>
            <span>
              ${listing.offer ? discountedPrice : listing.regularPrice.toLocaleString('en-US')}
              {listing.type === 'rent' && '/month'}
            </span>
            <span className='text-red-500'>
              {listing.type === 'rent' && 'For Rent'}
              {listing.type === 'sale' && 'For Sale'}
            </span>
          </p>
          <ul className='flex gap-5 flex-wrap font-medium text-sm mt-3'>
            <li className='flex gap-1 items-center'>
              <FaBed />
              {listing.bedrooms}
              {listing.bedrooms > 1 ? ' Beds' : ' Bed'}
            </li>
            <li className='flex gap-1 items-center'>
              <FaBath />
              {listing.bathrooms}
              {listing.bathrooms > 1 ? ' Bathrooms' : ' Bathroom'}
            </li>
          </ul>
        </div>
      </Link>
    </div>
  )
}
