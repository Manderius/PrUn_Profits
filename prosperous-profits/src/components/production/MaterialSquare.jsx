import React from 'react'
import './MaterialSquare.css';

export default function MaterialSquare({ data }) {
    return (
        <div className='square bg-info text-center font-weight-bold text-white'>
            <div className='ticker'>{data.Ticker}</div>
            {(() => {
                if (data.Amount) return <div className='amount'>{data.Amount}</div>
            })()}
        </div>
    )
}