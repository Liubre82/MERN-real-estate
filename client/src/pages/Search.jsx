import React from 'react'

export default function Search() {
    return (
        <div className='flex flex-col sm:flex-row'>
            <div className='p-7 border-b-2 sm:border-r-2 sm:min-h-screen' >
                <form className='flex flex-col gap-8 text-lg'>
                    <div className='flex items-center gap-2'>
                        <label htmlFor="searchTerm" className='whitespace-nowrap font-semibold'>Search Term: </label>
                        <input type="text" id='searchTerm' placeholder='Search...' className='border p-3 rounded-lg w-full'/>
                    </div>
                    <div className='flex gap-3 flex-wrap items-center'>
                        <p>Type: </p>
                        <div className='flex gap-1 items-center'>
                            <input type="checkbox" id='rent&sale' className='w-5 h-5'/>
                            <label htmlFor="rent&sale">Rent & Sale</label>
                        </div>
                        <div className='flex gap-1 items-center'>
                            <input type="checkbox" id='rent' className='w-5 h-5'/>
                            <label htmlFor="rent">Rent</label>
                        </div>
                        <div className='flex gap-1 items-center'>
                            <input type="checkbox" id='sale' className='w-5 h-5'/>
                            <label htmlFor="sale">Sale</label>
                        </div>
                        <div className='flex gap-1 items-center'>
                            <input type="checkbox" id='offer' className='w-5 h-5'/>
                            <label htmlFor="offer">Offer</label>
                        </div>
                        
                    </div>
                    <div className='flex gap-3 flex-wrap items-center'>
                        <p>Amenities: </p>
                        <div className='flex gap-1 items-center'>
                            <input type="checkbox" id='parking' className='w-5 h-5'/>
                            <label htmlFor="parking">Parking</label>
                        </div>
                        <div className='flex gap-1 items-center'>
                            <input type="checkbox" id='furnished' className='w-5 h-5'/>
                            <label htmlFor="furnished">Furnished</label>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="sort_order">Sort:</label>
                        <select name="sort_order" id="sort_order">
                            <option>Price High to Low</option>
                            <option>Price Low to High</option>
                            <option>Latest</option>
                            <option>Oldest</option>
                        </select>
                    </div>
                    <button className='bg-slate-700 p-3 rounded-lg text-white uppercase font-semibold hover:underline hover:opacity-90'>Search</button>
                </form>
            </div>
            <div className=''>
                <h1 className='font-bold text-3xl border-b-2 text-slate-700 p-3 mt-5'>Listing Results:</h1>
            </div>
        </div>
    )
}
