import React from 'react';

const ConfirmItem = ({item, quantity}) => {
    return(
        <li className="list-group-item d-flex justify-content-between align-items-center">{item.name}<span className="badge badge-primary badge-pill">{quantity}</span></li>
    )
}

export default ConfirmItem;