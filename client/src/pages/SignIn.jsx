import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice.js'


export default function SignIn() {
  const[formData, setFormData] = useState({})
  const { loading, error } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value 
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      dispatch(signInStart())
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData) 
      })
      const data = await res.json()

      if(data.success === false) {
        console.log("BAd")
        dispatch(signInFailure(data.message))
        return
      }
      dispatch(signInSuccess(data))
      navigate('/')
    } catch(err) {
      dispatch(signInFailure(err.message))
    }
  }


  return (
    <div className='p-3 max-w-lg mx-auto'>

      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'> 
        <input type="text" name='username' id='username' placeholder='username' className='border p-3 rounded-lg' onChange={handleChange}/>
        <input type="password" name='password' id='password' placeholder='password' className='border p-3 rounded-lg' onChange={handleChange}/>
        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-70'>{loading ? 'Loading...' : 'Sign In'}</button>
      </form>

      <div className='flex gap-2 mt-5'>
        <p>Dont have an account? </p>
        <Link to={'/sign-up'}>
          <span className='text-blue-700 hover:underline'>Sign Up</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>} {/*Short circuit evaluation*/}
    </div>
  )
}
