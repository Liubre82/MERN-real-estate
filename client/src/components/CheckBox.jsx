import React from 'react'

export default function CheckBox({name, checkBoxToggle, handleChange}) {
    return (
        <div className='flex gap-1 items-center'>
            <input type="checkbox" id={name} className='w-5 h-5' onChange={handleChange} checked={checkBoxToggle} />
            <label htmlFor={name}>{name}</label>
        </div>
    )
}
