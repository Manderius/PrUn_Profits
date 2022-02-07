import React from 'react'
import { useSelector } from 'react-redux';
import './MaterialSquare.css';

export default function MaterialSquare({ item }) {
    const materials = useSelector(state => state.data.materials);
    const category = materials.hasOwnProperty(item.Ticker) ? materials[item.Ticker].Category : "INVALID";
    const categoryData = useSelector(state => state.data.categories[category]);

    return (
        <div className='square bg-info text-center font-weight-bold text-white'>
            <div className='ticker' style={{ background: categoryData.background, color: categoryData.color }}>{item.Ticker}</div>
            {(() => {
                if (item.Amount) return <div className='amount'>{item.Amount}</div>
            })()}
        </div>
    )
}