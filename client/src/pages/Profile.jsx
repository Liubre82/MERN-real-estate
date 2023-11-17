import { useSelector } from 'react-redux'
import { useRef, useState, useEffect } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user)
  const profileImg = currentUser.accountImage
  const fileRef = useRef(null)
  const [file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [formData, setFormData] = useState({})
  //firebase storage
  // allow read;
  // allow write: if
  // request.resource.size < 2 * 1024 * 1024 && 
  // request.resource.contentType.matches('images/.*')

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, accountImage: downloadURL })
        );
      }
    );
  };

  return (
    <div className='max-w-lg m-auto p-3'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>

      <form className='flex flex-col gap-5'>
        <input onChange={(event) => setFile(event.target.files[0])} type="file" ref={fileRef} />

        <img onClick={() => fileRef.current.click()} className='rounded-full h-24 w-24 object-cover self-center mt-2' src={formData.accountImage || currentUser.accountImage} alt="Profile Image" />
        <p>
        {fileUploadError ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>

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
