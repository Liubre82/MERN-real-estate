import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";

export default function Contact({ listing }) {

    const [landLordUserInfo, setLandLordUserInfo] = useState(null)
    const [message, setMessage] = useState('')

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch(`/api/user/${listing.userRef}`)
                const data = await res.json()
                setLandLordUserInfo(data)
            } catch (err) {
                console.log(err)
            }

        }
        getUser()
    }, [listing.userRef])

    const handleMessage = (e) => {
        setMessage(e.target.value)
    }

    return (
        <>
            {landLordUserInfo && 
            <div className='flex flex-col gap-3'>
                <p className='text-lg'>Contact <span className='font-semibold'>{landLordUserInfo.username}</span> for <span className='font-semibold'>{listing.name.toLowerCase()}</span></p>
                <textarea onChange={handleMessage} value={message} name="message" id="message" rows="3" placeholder='Enter your message here...' className='w-full border p-3 rounded-lg'></textarea>
                <Link to={`mailto:${landLordUserInfo.email}?subject=Regarding ${listing.name}&body=${message}`} className='bg-slate-700 text-white text-center p-3 rounded-lg font-semibold hover:opacity-90 hover:underline'>
                    Send Message
                </Link>
            </div>}
            
        </>
    )
}
