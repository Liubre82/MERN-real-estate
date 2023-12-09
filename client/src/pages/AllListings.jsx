import React, { useEffect, useState } from 'react'
import ListingCard from '../components/ListingCard'

export default function AllListings() {

    const [allListings, setAllListings] = useState([])
    const [loading, setLoading] = useState(false)

    //fetches all listings fron the listings collections.
    useEffect(() => {
        const fetchAllListings = async () => {
            try {
                setLoading(true)
                const res = await fetch(`api/listings/`)
                const data = await res.json()
                setAllListings(data)
                setLoading(false)
            } catch (err) {
                setLoading(false)
                console.log(err)
            }
        }
        fetchAllListings()
    }, [])

    return (
        <div className='mt-5 p-10 max-w-screen-2xl mx-auto'>
            <h1 className='text-center font-mono font-bold text-4xl border-b-2 text-slate-700 mb-10'>All Property Listings</h1>
            {loading && <p className='text-2xl text-center mt-5'>Loading...</p>}
            {!loading && allListings &&
                <div className='flex flex-wrap gap-5 mt-5 max-w-screen-2xl mx-auto justify-evenly'>
                    {allListings.map(listing => (
                        <ListingCard key={listing._id} listing={listing} />
                    ))}

                </div>
            }
        </div>
    )
}
