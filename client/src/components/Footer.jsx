import React from 'react'
import { Link } from 'react-router-dom'
import { IoIosMail } from "react-icons/io";
import { FaPhone, FaLocationDot } from "react-icons/fa6";

export default function Footer() {
    const emailTo = 'brentliu0@gmail.com'

    return (
        <footer className='text-sm sm:text-lg  absolute bottom-0 bg-slate-700 text-white w-full p-3 sm:p-5 items-center flex justify-between flex-col md:flex-row'>
            {/* Website Name */}
            <div>
                <Link to='/'>
                    <h1 className='flex flex-wrap hover:underline text-2xl'>
                        <span className=' font-bold '>Estate</span>
                        <span className=''>Finder</span>
                    </h1>
                </Link>

            </div>
            {/* copright & designer name section */}
            <div className='flex gap-5 items-center md:flex-col'>
                <span>Copyright &copy;2023</span>
                <span>Designed by Brent Liu</span>
            </div>
            {/* designer information section */}
            <div className='flex flex-col gap-2 justify-between'>
                <Link to={`mailto:${emailTo}`} className='hover:underline'>
                    <p className='flex items-center gap-3'>
                        <span ><IoIosMail className='text-2xl' /></span>
                        <span>{emailTo}</span>
                    </p>
                </Link>
                <p className='flex items-center gap-3'>
                    <span ><FaPhone className='text-2xl' /></span>
                    <span>609-238-3006</span>
                </p>
                <p className='flex items-center gap-3'>
                    <span ><FaLocationDot className='text-2xl' /></span>
                    <span>Cherry Hill, NJ</span>
                </p>
            </div>
        </footer>
    )
}
