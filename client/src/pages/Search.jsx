import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid';
import ListingCard from '../components/ListingCard.jsx';

export default function Search() {

    const [formData, setFormData] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'created_at',
        order: 'desc'
    })
    const [loading, setLoading] = useState(false)
    const [listings, setListings] = useState([])
    const navigate = useNavigate()

    //useEffect runs everytime there is a change in location.search/query strings in URL, this function is for when for some reason a user changes a query string in the url.
    useEffect(() => {
        //The location.search property contains the query string of an URI (including the ?), if any.
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get('searchTerm')
        const typeFromUrl = urlParams.get('type')
        const parkingFromUrl = urlParams.get('parking')
        const furnishedFromUrl = urlParams.get('furnished')
        const offerFromUrl = urlParams.get('offer')
        const sortFromUrl = urlParams.get('sort')
        const orderFromUrl = urlParams.get('order')

        //if there are any changes to any of the queryStrings in the url, change it in the formData state as well so it reflects in our <input /> values in the form.
        if (searchTermFromUrl ||
            typeFromUrl ||
            parkingFromUrl ||
            furnishedFromUrl ||
            offerFromUrl ||
            sortFromUrl ||
            orderFromUrl) {
            setFormData({
                searchTerm: searchTermFromUrl || '',
                type: typeFromUrl || 'all',
                parking: parkingFromUrl === 'true' ? true : false,
                furnished: furnishedFromUrl === 'true' ? true : false,
                offer: offerFromUrl === 'true' ? true : false,
                sort: sortFromUrl || 'created_at',
                order: orderFromUrl || 'desc',
            });
        }

        const fetchListings = async () => {
            try {
                setLoading(true)
                const searchQuery = urlParams.toString()
                const res = await fetch(`/api/listing/getList?${searchQuery}`)
                const data = await res.json()
                if(data.length > 8) {

                }
                console.log(data)
                setListings(data)
                setLoading(false)
            } catch (err) {
                setLoading(false)
                console.log(err)
            }

        }
        fetchListings()
    }, [location.search])


    const handleChange = (e) => {
        if (e.target.id === 'searchTerm') {
            setFormData({ ...formData, [e.target.id]: e.target.value })
        }

        if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
            setFormData({ ...formData, type: e.target.id })
        }

        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setFormData({
                ...formData,
                [e.target.id]:
                    e.target.checked || e.target.checked === 'true' ? true : false,
            });
        }

        if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'created_at'
            const order = e.target.value.split('_')[1] || 'desc'

            setFormData({ ...formData, sort, order })
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const urlParams = new URLSearchParams()
        urlParams.set('searchTerm', formData.searchTerm)
        urlParams.set('type', formData.type)
        urlParams.set('parking', formData.parking)
        urlParams.set('furnished', formData.furnished)
        urlParams.set('offer', formData.offer)
        urlParams.set('sort', formData.sort)
        urlParams.set('order', formData.order)
        const searchQuery = urlParams.toString()
        navigate(`/search?${searchQuery}`)
    }
    return (
        <div className='flex flex-col sm:flex-row max-w-screen-2xl
        max-width: 1536px; mx-auto mt-5'>
            <section className='flex p-7 border-b-2 sm:border-r-2 sm:min-h-screen' >
                <form onSubmit={handleSubmit} className='flex flex-col gap-8 text-lg'>
                    <div className='flex items-center gap-2'>
                        <label htmlFor="searchTerm" className='whitespace-nowrap font-semibold'>Search Term: </label>
                        <input type="text" id='searchTerm' placeholder='Search...' className='border p-3 rounded-lg w-full' onChange={handleChange} value={formData.searchTerm} />
                    </div>
                    <div className='flex gap-3 flex-wrap items-center'>
                        <p>Type: </p>
                        <div className='flex gap-1 items-center'>
                            <input type="checkbox" id='all' className='w-5 h-5' onChange={handleChange} checked={formData.type === 'all'} />
                            <label htmlFor="all">Rent & Sale</label>
                        </div>
                        <div className='flex gap-1 items-center'>
                            <input type="checkbox" id='rent' className='w-5 h-5' onChange={handleChange} checked={formData.type === 'rent'} />
                            <label htmlFor="rent">Rent</label>
                        </div>
                        <div className='flex gap-1 items-center'>
                            <input type="checkbox" id='sale' className='w-5 h-5' onChange={handleChange} checked={formData.type === 'sale'} />
                            <label htmlFor="sale">Sale</label>
                        </div>
                        <div className='flex gap-1 items-center'>
                            <input type="checkbox" id='offer' className='w-5 h-5' onChange={handleChange} checked={formData.offer} />
                            <label htmlFor="offer">Offer</label>
                        </div>

                    </div>
                    <div className='flex gap-3 flex-wrap items-center'>
                        <p>Amenities: </p>
                        <div className='flex gap-1 items-center'>
                            <input type="checkbox" id='parking' className='w-5 h-5' onChange={handleChange} checked={formData.parking} />
                            <label htmlFor="parking">Parking</label>
                        </div>
                        <div className='flex gap-1 items-center'>
                            <input type="checkbox" id='furnished' className='w-5 h-5' onChange={handleChange} checked={formData.furnished} />
                            <label htmlFor="furnished">Furnished</label>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="sort_order">Sort:</label>
                        <select name="sort_order" defaultValue={'created_at_desc'} id="sort_order" onChange={handleChange}>
                            <option value='regularPrice_desc'>Price High to Low</option>
                            <option value='regularPrice_asc'>Price Low to High</option>
                            <option value='createdAt_desc'>Latest</option>
                            <option value='createdAt_asc'>Oldest</option>
                        </select>
                    </div>
                    <button className='bg-slate-700 p-3 rounded-lg text-white uppercase font-semibold hover:underline hover:opacity-90'>Search</button>
                </form>
            </section>
            <section className='p-7 flex-1'>
                <h1 className='font-bold text-3xl border-b-2 text-slate-700'>Listing Results:</h1>
                <div className='flex flex-wrap mt-5 gap-5'>
                    {loading && <p className='mt-5 text-center text-2xl font-bold w-full'>Loading...</p>}
                    {!loading && listings.length === 0 && <p className='mt-5 text-3xl font-bold w-full'>No Listings Found!!!</p>}
                    {!loading && listings && listings.map(listing => (
                        <ListingCard key={uuidv4()} listing={listing} />
                    ))}
                </div>

            </section>
        </div>
    )
}
