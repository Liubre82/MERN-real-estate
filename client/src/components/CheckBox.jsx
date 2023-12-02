import React from 'react'

export default function CheckBox({id, checkBoxToggle, handleChange, name}) {

    return (
        <div className='flex gap-1 items-center'>
            <input type="checkbox" id={id} className='w-5 h-5' onChange={handleChange} checked={checkBoxToggle} />
            <label htmlFor={id}>{name}</label>
        </div>
    )
}
