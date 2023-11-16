import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function SignIn() {
  const[formData, setFormData] = useState({})

  const handleChange = (event) => {
    setFormData(
      {...formData, [event.target.name]: event.target.value}
    )
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const res = await fetch('/api/auth/signin', {
      method: "POST",
      headers: {"Content-type": "application/json"},
      body: JSON.stringify(formData),

    })
    const data = res.json()
  }
  console.log(formData)

  return (
    <div className=' max-w-lg m-auto'>
      <h1 className='text-3xl text-center m-5'>Sign In</h1>

      <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
        <input className='p-3 rounded-lg' type="text" name='username' id='username' placeholder='username' onChange={handleChange}/>

        <input className='p-3' type="password" name='password' id='password' placeholder='password' onChange={handleChange}/>
        <button className='p-3 bg-slate-700 text-slate-100'>Sign In</button>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Dont have an account? </p>
        <Link to={'/sign-up'}>
          <span className='text-blue-700 hover:underline'>Sign Up</span>
        </Link>
      </div>
    </div>
  )
}
