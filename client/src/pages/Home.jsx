import { Link } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules'
import { v4 as uuidv4 } from 'uuid';
import 'swiper/css/bundle'
import ListingCard from '../components/ListingCard'

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
        const res = await fetch('/api/listing/getList?offer=true&limit=3')
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
            <h1 className='font-bold font-mono text-5xl'>Find your next favorite <br /> estate with us!!!</h1>
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
      <Swiper navigation className='mt-20'>
        {
          offerListings && offerListings.length > 0 &&
          offerListings.map(listing => (
            <SwiperSlide key={uuidv4()}>
              <div className='h-[650px] lg:h-[800px]' key={uuidv4()} style={{ background: `url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize: "cover" }}>

              </div>
            </SwiperSlide>
          ))
        }
      </Swiper>


      {/* displays the most recent listings from category offer, sale, & rent, displays at most 4 listing cards.*/}
      <CategoryListings listings={offerListings} listingProperty={'offer'} value={'Offer'}/>
      <CategoryListings listings={rentListings} listingProperty={'type'} value={'Rent'}/>
      <CategoryListings listings={saleListings} listingProperty={'type'} value={'Sale'}/>
    </div>

  )
}
