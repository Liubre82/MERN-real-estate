import { Link } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules'
import 'swiper/css/bundle'
import ListingCard from '../components/ListingCard'
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const [offerListings, setOfferListings] = useState([])
  const [rentListings, setRentListings] = useState([])
  const [saleListings, setSaleListings] = useState([])
  SwiperCore.use([Navigation])

  console.log('offer', offerListings)
  console.log('rent', rentListings)
  console.log('sale', saleListings)

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
    <div className=''>
      <section className='flex flex-col gap-6 p-28 px-12 max-w-screen-2xl mx-auto'>
        <div className=''>
          <h1 className='font-bold font-mono text-5xl'>Find your next favorite <br /> estate with us!!!</h1>
        </div>
        <div className=' text-slate-700 text-lg font-semibold'>
          EstateFinder is the easiest, quickest way to help you find your next home or stay.
          <br />
          We have a wide variety of properties for you to choose from!
        </div>
        <Link to={'/search'} className='text-blue-700 font-bold hover:underline text-lg'>Explore Our Properties...
        </Link>
      </section>
      <section>
        {/* Swiper */}
        <Swiper navigation>
          {
            offerListings && offerListings.length > 0 &&
            offerListings.map(listing => (
              <SwiperSlide>
                <div className='h-[500px]' key={uuidv4()} style={{ background: `url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize: "cover" }}>

                </div>
              </SwiperSlide>
            ))
          }
        </Swiper>
        {/* display listings of offer, sale, & rent */}
        <div className='max-w-screen-2xl mx-auto p-3 flex flex-col gap-8 my-10'>
          {offerListings && offerListings.length > 0 && (
            <div>
              <div className='my-5'>
                <h2 className='text-3xl font-semibold'>Recent Offers</h2>
                <Link to={'/search?offer=true'} className='text-blue-700 font-bold hover:underline text-lg'>
                  Show more offers
                </Link>
              </div>
              <div className='flex flex-wrap gap-5'>
                {offerListings.map(listing => (
                  <ListingCard key={uuidv4()} listing={listing}/>
                ))}
              
              </div>
              
            </div>
          )}
        </div>

      </section>
      <section >
        {/* display listings of offer, sale, & rent */}
        <div className='max-w-screen-2xl mx-auto p-3 flex flex-col gap-8 my-10'>
          {rentListings && rentListings.length > 0 && (
            <div>
              <div className='my-5'>
                <h2 className='text-3xl font-semibold'>Rent</h2>
                <Link to={'/search?type=rent'} className='text-blue-700 font-bold hover:underline text-lg'>
                  Show more Rental Properties
                </Link>
              </div>
              <div className='flex flex-wrap gap-5'>
                {rentListings.map(listing => (
                  <ListingCard key={uuidv4()} listing={listing}/>
                ))}
              
              </div>
              
            </div>
          )}
        </div>
      </section>
    </div>

  )
}
