import { Link } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules'
import { v4 as uuidv4 } from 'uuid';
import 'swiper/css/bundle'
import ListingCard from '../components/ListingCard'
import { Virtual } from 'swiper/modules';
import CategoryListings from '../components/categoryListings'

export default function Home() {
  const [offerListings, setOfferListings] = useState([])
  const [rentListings, setRentListings] = useState([])
  const [saleListings, setSaleListings] = useState([])
  SwiperCore.use([Navigation])

  //fetches the most recently added listings of the 3 categories offer, rent, & sale
  useEffect(() => {

    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/getList?offer=true&limit=4')
        const data = await res.json()
        setOfferListings(data)
        fetchRentListings()
      } catch (err) {
        console.log(err)
      }
    }

    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/getList?type=rent&limit=4')
        const data = await res.json()
        setRentListings(data)
        fetchSaleListings()
      } catch (err) {
        console.log(err)
      }
    }

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/getList?type=sale&limit=4')
        const data = await res.json()
        setSaleListings(data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchOfferListings()
  }, [])

  return (
    <div>
      <div className='flex flex-col mt-32 mx-auto items-center gap-10 lg:flex-row justify-center'>
        <div className='flex flex-col gap-6 px-12'>
          <div>
            <h1 className='font-bold font-mono text-5xl'>Find your next <br /> estate with us!!!</h1>
          </div>
          <div className=' text-slate-700 text-lg font-semibold'>
            EstateFinder is the easiest, quickest way to help you find your next home or stay.
            <br />
            We have a wide variety of properties for you to choose from!
          </div>
          <Link to={'/search'} className='text-blue-700 font-bold hover:underline text-lg'>Explore Our Properties...
          </Link>
        </div>


      </div>


      <div className='w-full lg:max-w-screen-2xl mx-auto'>
      <Swiper modules={[Virtual]} className='mt-20'>
        {
          offerListings && offerListings.length > 0 &&
          offerListings.map(listing => (
            <SwiperSlide key={uuidv4()}>
              <div className='w-full h-auto lg:h-[700px] md:w-5/6 object-fill md:object-contain' key={uuidv4()}>
                  <img src={listing.imageUrls[0]} alt={listing.imageUrls[0]} className='object-contain w-5/6 mx-auto'/>
              </div>
            </SwiperSlide>
          ))
        }
      </Swiper>

      </div>


      {/* displays the most recent listings from category offer, sale, & rent, displays at most 4 listing cards.*/}
      <CategoryListings listings={offerListings} listingProperty={'offer'} value={'Offer'}/>
      <CategoryListings listings={rentListings} listingProperty={'type'} value={'Rent'}/>
      <CategoryListings listings={saleListings} listingProperty={'type'} value={'Sale'}/>
    </div>

  )
}
