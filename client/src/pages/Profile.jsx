import { useSelector } from 'react-redux'

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user)
  const profileImg = currentUser.accountImage

  return (
    <div className='max-w-lg m-auto p-3'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>

      <form className='flex flex-col gap-5'>
        <img className='rounded-full h-24 w-24 object-cover self-center mt-2' src={profileImg} alt="Profile Image" />
        <input className='border rounded-lg p-3 ' type="text" name='username' id='username' placeholder='username' />

        <input className='border rounded-lg p-3 ' type="email" name='email' id='email' placeholder='email' />

        <input className='border rounded-lg p-3 ' type="password" name='password' id='password' placeholder='password' />

        <button className='bg-slate-700 text-white rounded-lg p-3 hover:opacity-90 disabled:opacity-70'>Update</button>
      </form>
      
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 hover:underline cursor-pointer'>Delete Account</span>
        <span className='text-red-700 hover:underline cursor-pointer'>Sign Out</span>
      </div>
    </div>

  )
}
