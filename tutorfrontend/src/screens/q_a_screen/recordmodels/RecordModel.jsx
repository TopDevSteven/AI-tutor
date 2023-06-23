import React, {useState} from 'react'
import './RecordModel.scss'
import {ReactComponent as BrandIcon} from '../../../assets/images/brand-item.svg'
import { FaPencilAlt } from 'react-icons/fa'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'
import { GrDocumentText } from 'react-icons/gr'
import { MdDeleteOutline } from 'react-icons/md'


export const RecordModel = ({name, type, status, date, spec, onClick}) => {
    const [isLoading, setIsLoading] = useState(false);
    const handleClick = () => {
        setIsLoading(true);

        // Simulating an asynchronous task
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }
    return (
        <div className='record' onClick={onClick}>
            <div className='content'>
                <div className='icon'>
                    <BrandIcon style={{ backgroundColor: "white", borderRadius: "8px", border: "1px solid #eef1f5", width: "100%", height: "100%"}}/>
                </div>
                <div className='info'>
                    <div className='name'>{name}</div>
                    <div className='spec'>{spec}</div>
                </div>
            </div>
            <div className='details'>
                <div className='type'><GrDocumentText className='icon'/>{type}</div>
                <button className="spin-button" onClick={handleClick} disabled={isLoading} style={isLoading ? {backgroundColor:"#ff3235"} : {backgroundColor: "#7fdbb6"}}>
                    {isLoading ? (<><div className="spinner"></div><div style={{marginLeft:"20px"}}>Loading</div></>) : status}
                </button>
                <div className='date'>{date}</div>
            </div>
            <div className='actions'>
                <button className='edit'><FaPencilAlt className='icon'/></button>
                <button className='like'><AiOutlineStar className='icon'/></button>
                <button className='delete'><MdDeleteOutline className='icon'/></button>
            </div>
            <div>

            </div>

        </div>
    )
}
