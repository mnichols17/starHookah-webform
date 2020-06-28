import React, {useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import ReactLoading from 'react-loading';
import queryString from 'query-string';

import '../styles/styles.css';
import Item from './ItemList';
import ConfirmItem from './Confirm';

const App = () => {

	const [page, setPage] = useState(0);
	const [items, setItems] = useState([]);
	const [cart, setCart] = useState({});
	const [cartSize, setSize] = useState(0);
	const [total, setTotal] = useState(0);

	useEffect(() => {
		//mdo0G61dwIMVMTGauTTnNtUeNTp2
		const getData = async() => {
			axios.get(`/api/order/${queryString.parse(window.location.search).user}`)
			.then(res => setItems(res.data.items))
			.catch(err => setPage(3))
		}
		getData();
	}, [])

	const editCart = useCallback((id, cost, add) => {
		const newCart = {...cart};
		if(add){
			newCart[id] = newCart[id] ? newCart[id] + 1 : 1;
		} else {
			newCart[id] = newCart[id] ? newCart[id] -1 : 0;
		}
		setTotal(add ? total + cost : total - cost);
		setSize(add ? cartSize + 1 : cartSize - 1);
		setCart(newCart);
	}, [cart, total])

	const createOrder = async() => {
		let order = []
        items.forEach(item => {
            const quantity = cart[item.ItemID];
            if (quantity > 0) order.push({itemID: item.ItemID, name: item.name, notes: "", quantity, unitCost: quantity * item.cost})
		})

		axios.post(`/api/order/${queryString.parse(window.location.search).user}`, {cart: order})
		.then(res => console.log(res))
		.catch(err => setPage(3))
	}

	let title, sub, view, buttonText;

	switch(page){
		case(3):
			title = "Error";
			sub = "Invalid UID";
			break;
		case(2):
			createOrder();
			title = "Thanks!";
			sub = "You're order has been placed";
			view = "Please return to the app";
			break;
		case(1):
			title = "Cart";
			sub = `Total: $${total}`;
			view = view = <ul className="list-group">{items.map(item => cart[item.ItemID] > 0 ? <ConfirmItem key={item.ItemID} item={item} quantity={cart[item.ItemID]}/> : null)}</ul>
			buttonText = "Checkout";
			break; 
		default:
			title = "Store";
			sub = `Items in cart: ${cartSize}`;
			view = 
			<div id="item-container">
				{items.length > 0 ? 
				items.map(item => item.restricted_item ? <Item key={item.ItemID} item={item} quantity={cart[item.ItemID]} edit={editCart} /> : null) 
				: <ReactLoading id="loading" type={'spin'} color={'#2199E8'} height={100} width={100} />}
			</div>
			buttonText = "Confirm";
	}
	
	return(
		<div className="flex">
			<h1 className="display-4">{title}</h1>
			<h5 style={{textAlign: 'center'}}>{sub}</h5>
			{view}
			{page < 2 ? <div id="button-group">
				<button style={{display: page === 1 ? 'block' : 'none'}} className="btn btn-primary" onClick={() => setPage(page - 1)}>Edit Cart</button>
				<button disabled={cartSize < 1} className="btn btn-primary" onClick={() => setPage(page + 1)}>{buttonText}</button>
			</div> : null}
		</div>
	)
}

export default (App);