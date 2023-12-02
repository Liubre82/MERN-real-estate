import { FaSearch } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'

export default function Header() {
  const { currentUser } = useSelector(state => state.user)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

const handleSubmit = (e) => {
  e.preventDefault()
  const urlParams = new URLSearchParams(window.location.search)
  urlParams.set('searchTerm', searchTerm)
  const searchQuery = urlParams.toString()
  navigate(`/search?${searchQuery}`)
}

//if the searchTerm query in the url is changed, useEffect will run & change the searchTerm value in the search inputbox as well.
useEffect(() => {
  const urlParams = new URLSearchParams(location.search)
  const searchTermFromUrl = urlParams.get('searchTerm')
  if(searchTermFromUrl) {
    setSearchTerm(searchTermFromUrl)
  }
},[location.search])
  return (
    <header className='bg-slate-200 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3 sm:p-5'>
        <Link to='/'>
          <h1 className='font-bold text-md sm:text-xl flex flex-wrap'>
            <span className='text-slate-500'>Estate</span>
            <span className='text-slate-700'>Finder</span>
          </h1>
        </Link>

        <form className='bg-slate-100 rounded-lg flex items-center p-3'>
          <input type="text" placeholder="Search..." className='bg-transparent focus: outline-none w-24 sm:w-64' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <button onClick={handleSubmit}>
            <FaSearch className='text-slate-600 border' />
          </button>
        </form>

        <ul className='flex gap-4 items-center'>
          <Link to='/'>
            <li className='hidden  text-slate-700 sm:inline hover:underline'>Home</li>
          </Link>
          <Link to='/about'>
            <li className='hidden  text-slate-700 sm:inline hover:underline'>About</li>
          </Link>

          <Link to='/profile'>
            {currentUser ? (
              <img className='rounded-full h-8 w-8 object-cover' src={currentUser.accountImage} alt='avatar' />
            ) : (<li className='hidden  text-slate-700 sm:inline hover:underline'>Sign In</li>)}

          </Link>

        </ul>
      </div>

    </header>
  )
}


// focus: outline-none' removes the border in a searchbox when clicked