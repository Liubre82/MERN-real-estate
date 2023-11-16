import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase'
import { useDispatch, useSelector } from 'react-redux'
import { signInSuccess } from '../redux/user/userSlice.js'
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
    const dispatch = useDispatch()
const navigate = useNavigate();
    const handleGoogleClick = async (event) => {
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)
            //result returns an obj with information about the user.
            const result = await signInWithPopup(auth, provider)
            console.log(result)
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username: result.user.displayName, email: result.user.email, photo: result.user.photoURL})
            })
            const data = await res.json()
            dispatch(signInSuccess(data))
            navigate('/');
        } catch(err) {
            console.log("couldnt sign in with google", err)
        }
    }

  return (
    //This OAuth component will be inside a form tag, and buttons by default are of type submit, to prevent this button from submitting, setting type to button will prevent it.
    <button onClick={handleGoogleClick} type='button' className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-90'>sign in with google</button>
  )
}
