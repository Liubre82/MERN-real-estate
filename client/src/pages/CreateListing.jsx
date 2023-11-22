import React from 'react'

export default function CreateListing() {
    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>
            <form className='flex flex-col sm:flex-row gap-5'>
                <div className='flex flex-col gap-4 flex-1'>
                    <input type="text" placeholder='Name' className='border p-3 rounded-lg' id='name' name='name' maxLength={62} minLength={10} required />
                    <textarea type="text" placeholder='Description' className='border p-3 rounded-lg' id='description' name='description' required />
                    <input type="text" placeholder='Address' className='border p-3 rounded-lg' id='address' name='address' required />
                    <div className='flex gap-6 flex-wrap'>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='sale' className='w-5' />
                            <label htmlFor="sale">Sell</label>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='rent' className='w-5' />
                            <label htmlFor="rent">Rent</label>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='park' className='w-5' />
                            <label htmlFor="park">Parking Spot</label>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='furnish' className='w-5' />
                            <label htmlFor="furnish">Furnished</label>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='offer' className='w-5' />
                            <label htmlFor="offer">Offer</label>
                        </div>
                    </div>
                    <div className='flex flex-wrap gap-6'>
                        <div className='flex gap-2 items-center'>
                            <input className='rounded-lg p-3 border-gray-300 ' type="number" id='bedrooms' min='1' max='10' required />
                            <label htmlFor="bedrooms">Beds</label>
                        </div>
                        <div className='flex gap-2 items-center'>
                            <input className='rounded-lg p-3 border-gray-300 ' type="number" id='bathrooms' min='1' max='10' required />
                            <label htmlFor="bathrooms">Bathrooms</label>
                        </div>
                        <div className='flex gap-2 items-center'>
                            <input className='rounded-lg p-3 border-gray-300 ' type="number" id='price' min='1' max='10' required />
                            <div className='text-center'>
                                <label className='block' htmlFor="price">Regular Price</label>
                                <span className='text-sm'>($ / month)</span>
                            </div>
                        </div>
                        <div className='flex gap-2 items-center'>
                            <input className='rounded-lg p-3 border-gray-300 ' type="number" id='discount' min='1' max='10' required />
                            <div className='text-center'>
                                <label className='block' htmlFor="discount">Discounted Price</label>
                                <span className='text-sm'>($ / month)</span>
                            </div>
                        </div>
                    </div>
                    
                </div>
                <div className='flex flex-col flex-1 gap-4'>
                    <div className='flex'>
                        <p className='font-semibold'>Images: </p>
                        <span className='font-normal text-gray-600 ml-2'>The first image will be the thumbnail (max 6 imgs)</span>
                    </div>

                    <div className='flex gap-4'>
                        <input className='p-3 border border-gray-500' type="file" id='images' accept='image/*' multiple />
                        <button className='p-3 text-green-700 border border-green-700 rounded hover:shadow-xl disabled:opacity-80'>Upload Image(s)</button>
                    </div>
                    <button className='mt-5 p-3 border rounded-lg bg-slate-700 text-white hover:opacity-95 hover:underline'>Create Listing</button>
                </div>
            </form>

        </main>
    )
}
