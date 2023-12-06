import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth'

export default function SignUp() {
  const[formData, setFormData] = useState({})
  const[error, setError] = useState(null)
  const[loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (event) => {
    //insert all the elements/properties in the formData obj, then add or change a property depending on whether the property already exists or not inside the formData obj
    setFormData({
      ...formData,
      [event.target.name]: event.target.value //computed property name ES6, dynamically adding a key name with [] syntax in which it converts the variable to a string literal & sets the key name to it.
    })
  }

  const handleSubmit = async (event) => {
    //fetch sends a post request from the client, and returns a promise. body: is the data that we will be sending, we serialized it by using stringify(), we will post the info to the endpoint and our signup 'post' route handler will handle this post request and return either a json or an err obj from the error handler
    //https://www.freecodecamp.org/news/javascript-post-request-how-to-send-an-http-post-request-in-js/
    event.preventDefault()
    try {
      setLoading(true) //program is loading, and trying to post data.
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData) //serialize the data being sent to the server.
      })
      const data = await res.json()
      //if post request fails, our post auth signup route handler will throw an err and run our err handler in index.js, and set our err json success property to false.
      if(data.success === false) { //if success is false from our error handler set err msg and end the loading
        setError(data.message)
        setLoading(false)
        return
      }
      setLoading(false) //post request is successful, end the loading by setting it false.
      setError(null) 
      navigate('/sign-in')
    } catch(err) {
      setError(err.message)
      setLoading(false)
    }

    //console.log("returned: ", data)
  }


  return (
    <div className='p-3 max-w-lg mx-auto'>

      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'> 
        <input type="text" name='username' id='username' placeholder='username' className='border p-3 rounded-lg' onChange={handleChange}/>
        <input type="email" name='email' id='email' placeholder='email' className='border p-3 rounded-lg' onChange={handleChange}/>
        <input type="password" name='password' id='password' placeholder='password' className='border p-3 rounded-lg' onChange={handleChange}/>
        <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-70'>{loading ? 'Loading...' : 'Sign Up'}</button>
        <OAuth />

      </form>

      <div className='flex gap-2 mt-5'>
        <p>Have an account? </p>
        <Link to={'/sign-in'}>
          <span className='text-blue-700 hover:underline'>Sign In</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>} {/*Short circuit evaluation*/}
    </div>
  )
}

/* 
main wapper div is set to a certain width using max-w-lg, mx-auto centers the div by automatically adding the same amount of margin to the right and left side to center the div. form box display is in flex and in columns to position elements in columns, gap-4 creates a space btw each element in the flex box. 
*/