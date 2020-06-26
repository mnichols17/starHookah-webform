import React from 'react';

export default ({item, quantity, edit}) => {
    return(
		<div className="card">
			<div className="card-body">
                <h5 className="card-title">{item.name}</h5>
                {/* <p className="card-text">${item.cost}</p> */}
                <p className="card-text">$10.00</p>
                <div className="quantity-group">
                    <button type="button" className="btn btn-secondary btn-lg rounded-circle" disabled={quantity > 0 ? false : true} onClick={() => edit(item.ItemID, item.cost, false)}>-</button>
                    <h4>{quantity || 0}</h4>
                    <button type="button" className="btn btn-secondary btn-lg rounded-circle" onClick={() => edit(item.ItemID, item.cost, true)}>+</button>
                </div>
			</div>
		</div>
	)
}