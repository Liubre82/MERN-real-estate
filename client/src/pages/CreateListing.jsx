import React, { useState } from 'react'
import { getStorage, uploadBytesResumable, ref, getDownloadURL, deleteObject  } from 'firebase/storage'
import { app } from '../firebase'

//an array of the filenames that are currently uploaded by the user.
const filenames = []

export default function CreateListing() {
    //stores the images the user uploads in an array
    const [files, setFiles] = useState([])
    const [formData, setFormData] = useState({ imageUrls: [] })
    const [imageUploadError, setImageUploadError] = useState(false)
    //uploading state will determine the text of the upload image button. if images are being uploaded it will display upload..., else it prints a static text saying upload image
    const [uploading, setUploading] = useState(false)
    
    const handleImageSubmit = (e) => {
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploading(true)
            setImageUploadError(false)
            const promises = []
            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]))
            }
            Promise.all(promises).then((urls) => {
                //adds images to the existing array, so if you upload some images and wanted to add more, it will not overwrite the previous uploads and instead concat/add to it.
                setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls)})
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

    const deleteImageFromFirebase = (index) => {
        const storage = getStorage(app);
        // Create a reference to the file to delete
        const desertRef = ref(storage, filenames[index]);
        // Delete the file
        deleteObject(desertRef).then(() => {
            console.log("image deleted from firebase")
        }).catch((error) => {
            console.log(error)
        });
    }

    const handleImageDelete = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => {
                //iterates the array and filters out the image in which the delete button was clicked on. the other images are returned and stored in a new array.
                return i !== index
            })
        })
        //delete the image from firebase
        deleteImageFromFirebase(index)
        //deletes the filename from the filenames array that stores the current uploaded images.
        filenames.splice(index, 1)

    }

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
    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>
            <form className='flex flex-col sm:flex-row gap-5'>
                <div className='flex flex-col gap-4 flex-1'>
                    <input type="text" placeholder='Name' className='border p-3 rounded-lg' id='name' name='name' maxLength={62} minLength={10} required />
                    <textarea type="text" placeholder='Description' className='border p-3 rounded-lg' id='description' name='description' required />
                    <input type="text" placeholder='Address' className='border p-3 rounded-lg' id='address' name='address' required />
                    <div className='flex gap-6 flex-wrap'>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='sale' className='w-5' />
                            <label htmlFor="sale">Sell</label>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='rent' className='w-5' />
                            <label htmlFor="rent">Rent</label>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='park' className='w-5' />
                            <label htmlFor="park">Parking Spot</label>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='furnish' className='w-5' />
                            <label htmlFor="furnish">Furnished</label>
                        </div>
                        <div className='flex gap-2'>
                            <input type="checkbox" id='offer' className='w-5' />
                            <label htmlFor="offer">Offer</label>
                        </div>
                    </div>
                    <div className='flex flex-wrap gap-6'>
                        <div className='flex gap-2 items-center'>
                            <input className='rounded-lg p-3 border-gray-300 ' type="number" id='bedrooms' min='1' max='10' required />
                            <label htmlFor="bedrooms">Beds</label>
                        </div>
                        <div className='flex gap-2 items-center'>
                            <input className='rounded-lg p-3 border-gray-300 ' type="number" id='bathrooms' min='1' max='10' required />
                            <label htmlFor="bathrooms">Bathrooms</label>
                        </div>
                        <div className='flex gap-2 items-center'>
                            <input className='rounded-lg p-3 border-gray-300 ' type="number" id='price' min='1' max='10' required />
                            <div className='text-center'>
                                <label className='block' htmlFor="price">Regular Price</label>
                                <span className='text-sm'>($ / month)</span>
                            </div>
                        </div>
                        <div className='flex gap-2 items-center'>
                            <input className='rounded-lg p-3 border-gray-300 ' type="number" id='discount' min='1' max='10' required />
                            <div className='text-center'>
                                <label className='block' htmlFor="discount">Discounted Price</label>
                                <span className='text-sm'>($ / month)</span>
                            </div>
                        </div>
                    </div>

                </div>
                <div className='flex flex-col flex-1 gap-4'>
                    <div className='flex'>
                        <p className='font-semibold'>Images: </p>
                        <span className='font-normal text-gray-600 ml-2'>The first image will be the thumbnail (max 6 imgs)</span>
                    </div>

                    <div className='flex gap-4'>
                        <input onChange={e => setFiles(e.target.files)} className='p-3 border border-gray-500' type="file" id='images' accept='image/*' multiple />
                        <button disabled={uploading} type='button' onClick={handleImageSubmit} className='p-3 text-green-700 border border-green-700 rounded hover:shadow-xl disabled:opacity-80'>{uploading ? 'Uploading...' : 'Upload Image(s)'}</button>
                    </div>
                    <p className='text-red-600'>
                        {imageUploadError && imageUploadError}
                    </p>
                    <div className='displayUploadedImage(s)'>
                        {
                            formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                                <div key={url} className='flex justify-between p-3 border items-center'>
                                    <img src={url} alt="listing image" className='w-20 h-20 object-contain rounded-lg' />
                                    <button onClick={() => handleImageDelete(index)} type='button' className=' text-red-600 p-3 rounded-lg hover:underline uppercase'>Delete</button>
                                </div>
                            ))
                        }
                    </div>

                    <button className='mt-5 p-3 border rounded-lg bg-slate-700 text-white hover:opacity-95 hover:underline'>Create Listing</button>
                </div>
            </form>

        </main>
    )
}
