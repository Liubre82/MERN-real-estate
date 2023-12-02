import React from 'react'

export default function About() {
  const estateImg = 'https://assets-global.website-files.com/5dcf94bbedfe6a4a06634ead/6215e88eabe334691b56afd3_real-estate-photo.jpg'

  return (

    <div className='mt-20 p-10 max-w-6xl mx-auto flex flex-col gap-10 lg:flex-row'>
      <div className='flex-1'>
        <h1 className='font-mono text-6xl font-bold text-slate-700'>About Us</h1>
        <div className='text-lg mt-3'>
          <p >
            We help people get home. Whether selling, buying, or renting. EstateFinder can help you get into your next home with speed, certainty and ease.
          </p>
          <br />
          <p>
            Choosing the right home can be difficult, but our goal is to make home searching easier and finding the perfect home a reality for more people, giving them a simpler, more seamless way to buy, sell or rent a new home.
          </p>
        </div>

      </div>
      <div>
        <img src={estateImg} alt="default.img" className='h-[350px] lg:h-[350px] w-full object-fill sm:object-cover' />
      </div>

    </div>

  )



}
