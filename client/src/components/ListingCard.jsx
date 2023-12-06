import React from 'react'
import { Link } from 'react-router-dom'
import { MdLocationOn } from 'react-icons/md'
import { FaBath, FaBed } from 'react-icons/fa';
import { IoIosStar } from "react-icons/io";
import { useState } from 'react'
export default function ListingCard({ listing }) {
  const getAverageRating = (arr) => {
    let sum = 0;
    if(arr.length === 0) {
      return 'No Rating'
    }
    for(let i = 0; i < arr.length; i++) {
      sum += arr[i].rating
    }

    const averageRating = (sum / arr.length).toFixed(2)
    return averageRating
  }
  const [ratingAverage, setRatingAverage] = useState(getAverageRating(listing.reviews))



  return (
    <div className=' hover:scale-105 bg-white rounded-lg shadow-lg w-full sm:w-[320px]'>
      <Link to={`/listing/${listing._id}`}>
        <div className='relative'>
        <img src={listing.imageUrls[0]} alt="Listing Thumbnail" className='relative h-[380px] sm:h-[220px] w-full object-cover rounded-t-lg' />
        <div className='bg-slate-200 rounded-lg absolute top-2.5 right-2.5 px-1 flex gap-1 items-center text-orange-500 font-semibold'><IoIosStar /> {ratingAverage}</div>
        </div>



        <div className='p-3'>
          <h1 className='text-xl truncate text-slate-700 font-bold mb-2'>{listing.name}</h1>
          <div className='flex gap-2 items-center mb-2'>
            <p className='font-semibold'>
              Posted By: {listing.userRef.username}
            </p>
            
            <p className='text-sm flex text-slate-500'><MdLocationOn className='h-4 w-4 text-green-700' /> {listing.address}</p>
          </div>

          <p className='line-clamp-2 text-sm'>{listing.description}</p>
          <p className='text-green-500 mt-3 font-semibold'>$
            {listing.offer ? listing.discountPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}
            {listing.type === 'rent' && ' / month'}
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
