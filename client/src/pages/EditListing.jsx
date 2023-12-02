import React, { useEffect, useState } from 'react'
import { getStorage, uploadBytesResumable, ref, getDownloadURL, deleteObject } from 'firebase/storage'
import { app } from '../firebase'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid';

//an array of the filenames that are currently uploaded by the user.
let filenames = []

export default function EditListing() {
    const params = useParams();
    const navigate = useNavigate()
    const { currentUser } = useSelector(state => state.user)
    //stores the files the user uploads from the file input and stores it in an array
    const [files, setFiles] = useState([])
    const [formData, setFormData] = useState({
        imageUrls: [],
        imageNames: [],
        name: "",
        description: "",
        address: "",
        regularPrice: 50,
        discountPrice: 0,
        bedrooms: 1,
        bathrooms: 1,
        furnished: false,
        parking: false,
        type: "rent",
        offer: false,
        userRef: ""
    })

    console.log(params.listingId)
    const [imageUploadError, setImageUploadError] = useState(false)
    //uploading state will determine the text of the upload image button. if images are being uploaded it will display upload..., else it prints a static text saying upload image
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState(false)
    //state for the loading status of when the form is submitted
    const [loading, setLoading] = useState(false)

    //retrieves the listing obj from the db to display the info as our 'initial form input values
    useEffect(() => { 
        const fetchListing = async () => {
            const res = await fetch(`/api/listing/getList/${params.listingId}`)
            const data = await res.json()
            if(data.success === false) {
                console.log(data.message)
                return
            }
            setFormData(data)
        }
        fetchListing()
        filenames = formData.imageNames
    },[])

    //function that saves a single image to our firebase storage
    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app)
            const fileName = new Date().getTime() + file.name
            filenames.push(fileName)
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef, file)
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    //console.log(`Upload is ${progress}% done`)
                },
                (error) => {
                    reject(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL)
                    })
                }
            )

        })
    }

    //adds every image that the user uploads to firebase using the storeImage function. sets up the imageUrls array  to be sent to the server by adding the urls of the images the user uploads. All the urls will be sent to the server when the form is submitted.
    const handleImageSubmit = (e) => {
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploading(true)
            setImageUploadError(false)
            const promises = []
            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]))
            }
            Promise.all(promises).then((urls) => {
                //adds images to the imageUrls array, and adds images to the existing array.  so if you upload some images and wanted to add more, it will not overwrite the previous uploads and instead concat/add to it.
                setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls),
                imageNames: formData.imageNames.concat(...filenames) })
                setImageUploadError(false)
                setUploading(false)
            }).catch((err) => {
                setUploading(false)
                setImageUploadError('Image upload failed')
            })
        } else {
            setImageUploadError('You can only upload a maximum of 6 images')
            setUploading(false)
        }

    }

    //function permanently deletes a single image from our firebase storage
    const deleteImageFromFirebase = (index) => {
        const storage = getStorage(app);
        // Create a reference to the file to delete
        const desertRef = ref(storage, formData.imageNames[index]);
        // Delete the file
        deleteObject(desertRef).then(() => {
            console.log("image deleted from firebase")
        }).catch((error) => {
            console.log(error)
        });
    }

    //
    const handleImageDelete = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => {
                //iterates the array and filters out the image in which the delete button was clicked on. the other images are returned and stored in a new array.
                return i !== index
            }),
            imageNames: formData.imageNames.filter((_, i) => {
                return i !== index
            })
        })
        //delete the image from our firebase storage permanently
        deleteImageFromFirebase(index)
        //deletes the filename from the filenames array that stores the current uploaded images.
        filenames.splice(index, 1)

    }

    //handle any changes that occur on the input elements inside the form tag
    const handleChange = (e) => {
        if (e.target.id === 'sale' || e.target.id === 'rent') {
            setFormData({
                ...formData,
                type: e.target.id
            })
        }
        if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked
            })
        }
        if (e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (formData.imageUrls.length < 1) {
                return setError('You must upload atleast one image')
            }
            if (+formData.regularPrice < +formData.discountPrice) {
                return setError('discount price cannot be greater than regular price')
            }
            setLoading(true)
            setError(false)
            const res = await fetch(`/api/listing/edit/${params.listingId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            console.log(data)
            setLoading(false)
            if(data.success === false) {
                setError(data.message)
            }        
            navigate(`/listing/${data._id}`)
        } catch (err) {
            setError(err.message)
            setLoading(false)
        }

    }
    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Edit Listing</h1>
            <form className='flex flex-col sm:flex-row gap-5'>
                {/* user inputs section */}
                <section className='flex flex-col gap-4 flex-1'>

                    <section className='flex flex-col gap-4'> {/* Text boxes */}
                        <input type="text" placeholder='Name' className='border p-3 rounded-lg' id='name' name='name' maxLength={62} minLength={10} required onChange={handleChange} value={formData.name} />
                        <textarea type="text" placeholder='Description' className='border p-3 rounded-lg' id='description' name='description' required
                            onChange={handleChange} value={formData.description} />
                        <input type="text" placeholder='Address' className='border p-3 rounded-lg' id='address' name='address' required onChange={handleChange} value={formData.address} />
                    </section>

                    <section className='flex gap-6 flex-wrap'>  {/* checkboxes */}
                        <div className='flex gap-2'>
                            <input type="checkbox" id='sale' className='w-5' onChange={handleChange} checked={formData.type === 'sale'} />
                            <label htmlFor="sale">Sell</label>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='rent' className='w-5' onChange={handleChange} checked={formData.type === 'rent'} />
                            <label htmlFor="rent">Rent</label>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='parking' className='w-5' onChange={handleChange} checked={formData.parking} />
                            <label htmlFor="parking">Parking Spot</label>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='furnished' className='w-5' onChange={handleChange} checked={formData.furnished} />
                            <label htmlFor="furnished">Furnished</label>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='offer' className='w-5' onChange={handleChange} checked={formData.offer} />
                            <label htmlFor="offer">Offer</label>
                        </div>
                    </section>

                    <section className='flex flex-wrap gap-6'> {/* Number input boxes section */}
                        <div className='flex gap-2 items-center'>
                            <input className='rounded-lg p-3 border-gray-300 ' type="number" id='bedrooms' min='1' max='10' required onChange={handleChange} value={formData.bedrooms} />
                            <label htmlFor="bedrooms">Beds</label>
                        </div>
                        <div className='flex gap-2 items-center'>
                            <input className='rounded-lg p-3 border-gray-300 ' type="number" id='bathrooms' min='1' max='10' required onChange={handleChange} value={formData.bathrooms} />
                            <label htmlFor="bathrooms">Bathrooms</label>
                        </div>
                        <div className='flex gap-2 items-center'>
                            <input className='rounded-lg p-3 border-gray-300 ' type="number" id='regularPrice' min='50' max='10000000' required onChange={handleChange} value={formData.regularPrice} />
                            <div className='text-center'>
                                <label className='block' htmlFor="regularPrice">Regular Price</label>
                                <span className='text-sm'>($ / month)</span>
                            </div>
                        </div>

                        {/* Only display discount price inputbox option if offer is checked */}
                        {formData.offer &&
                            <div className='flex gap-2 items-center'>
                                <input className='rounded-lg p-3 border-gray-300 ' type="number" id='discountPrice' min='0' max='10000000' required onChange={handleChange} value={formData.discountPrice} />
                                <div className='text-center'>
                                    <label className='block' htmlFor="discountPrice">Discounted Price</label>
                                    <span className='text-sm'>($ / month)</span>
                                </div>
                            </div>
                        }

                    </section>

                </section>

                {/* Image Upload and uploading listing button Section */}
                <section className='flex flex-col flex-1 gap-4'>
                    <div className='flex'>
                        <p className='font-semibold'>Images: </p>
                        <span className='font-normal text-gray-600 ml-2'>The first image will be the thumbnail (max 6 imgs)</span>
                    </div>

                    <div className='flex gap-4'>
                        <input onChange={e => setFiles(e.target.files)} className='p-3 border border-gray-500' type="file" id='images' accept='image/*' multiple />
                        <button disabled={uploading || files.length === 0} type='button' onClick={handleImageSubmit} className='p-3 text-green-700 border border-green-700 rounded font-semibold hover:shadow-xl disabled:shadow-none disabled:opacity-30'>{uploading ? 'Uploading...' : 'Upload Image(s)'}</button>
                    </div>
                    <p className='text-red-600'>
                        {imageUploadError && imageUploadError}
                    </p>
                    <div className='displayUploadedImage(s) flex flex-col gap-3'>
                        {
                            formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                                <div key={uuidv4()} className='flex justify-between p-3 border items-center'>
                                    <img src={url} alt="listing image" className='w-20 h-20 object-contain rounded-lg' />
                                    <button onClick={() => handleImageDelete(index)} type='button' className=' text-red-600 p-3 rounded-lg hover:underline uppercase'>Delete</button>
                                </div>
                            ))
                        }
                    </div>

                    <button type='button' disabled={loading || uploading} onClick={(handleSubmit)} className='mt-5 p-3 border rounded-lg bg-slate-700 text-white hover:opacity-95 hover:underline'>
                        {loading ? 'Updating Listing...' : 'Update Listing'}
                    </button>
                    {error && <p className='text-red-700 text-sm font-bold'>{error}</p>}
                </section>
            </form>

        </main>
    )
}
