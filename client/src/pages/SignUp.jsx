import React from 'react'
import {Link} from 'react-router-dom'

export default function SignUp() {
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form action="" className='flex flex-col gap-4'> 
        <input type="text" name='username' id='username' placeholder='username' className='border p-3 rounded-lg'/>
        <input type="email" name='email' id='email' placeholder='email' className='border p-3 rounded-lg'/>
        <input type="password" name='password' id='password' placeholder='password' className='border p-3 rounded-lg'/>
        <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-70'> Sign Up</button>

      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account? </p>
        <Link to={'/sign-in'}>
          <span className='text-blue-700 hover:underline'>Sign In</span>
        </Link>
      </div>
    </div>
  )
}

/* 
main wapper div is set to a certain width using max-w-lg, mx-auto centers the div by automatically adding the same amount of margin to the right and left side to center the div. form box display is in flex and in columns to position elements in columns, gap-4 creates a space btw each element in the flex box. 
*/