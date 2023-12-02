import React from 'react'
import { Link } from 'react-router-dom'
import ListingCard from './ListingCard'
import { v4 as uuidv4 } from 'uuid';

export default function CategoryListings({listings, listingProperty, value}) {

    const listingValue = value.toLowerCase()

    const booleanProperty = (listingProperty !== 'type' ? 'Rental' : value)
    return (
        <div className='max-w-screen-2xl mx-auto p-3 flex flex-col gap-8 my-10'>
            {listings && listings.length > 0 && (
                <div>
                    <div className='my-5'>
                        <h2 className='text-3xl font-semibold'>
                            Most Recent {(listingValue === 'rent' ? 'Rental' : value)}s
                        </h2>
                        <Link to={`/search?${listingProperty}=${listings[0][listingProperty]}`} className='text-blue-700 font-bold hover:underline text-lg'>
                            Show more {(listingValue === 'rent' ? 'Rental' : value)} Properties
                        </Link>
                    </div>
                    <div className='flex flex-wrap gap-5'>
                        {listings.map(listing => (
                            <ListingCard key={uuidv4()} listing={listing} />
                        ))}

                    </div>

                </div>
            )}
        </div>
    )
}
