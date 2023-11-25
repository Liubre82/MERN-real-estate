import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules'
import 'swiper/css/bundle'
import { v4 as uuidv4 } from 'uuid';

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
            <Swiper navigation>
              {listing.imageUrls.map((imgUrl, index) => {
                return <SwiperSlide key={uuidv4()}>
                  <div className='h-[550px]' style={{ background: `url(${imgUrl}) center no-repeat`, backgroundSize: 'cover'}}>

                  </div>
                </SwiperSlide>
              })}
            </Swiper>
          <section className='flex flex-col max-w-xl mx-auto gap-3 p-3 mt-5'>
            <h1 className='text-2xl font-semibold mb-5'>{listing.name} - $ {listing.regularPrice}</h1>
            <p>{listing.address}</p>
            <button className='bg-red-800 p-2 rounded-lg text-white hover:opacity-90 hover:underline self-start w-40'>For Sale</button>
            <p><b>Description- </b>{listing.description}</p>
            <section className='flex gap-10 flex-wrap font-medium'>
              <p>{listing.bedrooms} Beds</p>
              <p className={listing.parking ? 'text-green-700' : 'text-red-500'}>{listing.bathrooms} Bathrooms</p>
              <p>Parking Spot</p>
              <p>{listing.furnished ? '' : 'Not'} furnished</p>
            </section>
          </section>
        </div>



      }
    </main >
  )
}
