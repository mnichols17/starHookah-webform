import React, {useState, useEffect} from 'react';
import axios from 'axios';

export default ({item, quantity, edit}) => {

    const [imgUrl, setUrl] = useState('');

    useEffect(() => {
		const getItems = async() => {
            axios.get(`/api/image/${item.ItemID}`)
            .then(res => {
                setUrl(res.data)
            })
        }
        getItems();
	}, [])
    
    return(
		<div className="card">
			<div className="card-body">
                <div className="body-top">
                    {imgUrl !== '' ? <img className="card-img-top" src={imgUrl} alt="Card image cap" /> : null}
                    <h5 className="card-title">{item.name}</h5>
                    {/* <p className="card-text">${item.cost}</p> */}
                    <p className="card-text">$10.00</p>
                </div>
                <div className="quantity-group">
                    <button type="button" className="btn btn-secondary btn-lg rounded-circle" disabled={quantity > 0 ? false : true} onClick={() => edit(item.ItemID, item.cost, false)}>-</button>
                    <h4>{quantity || 0}</h4>
                    <button type="button" className="btn btn-secondary btn-lg rounded-circle" onClick={() => edit(item.ItemID, item.cost, true)}>+</button>
                </div>
			</div>
		</div>
	)
}