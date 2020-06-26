const express = require('express');
const path = require('path');
const firebase = require('firebase');
const admin = require('firebase-admin');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

app.use(express.json());

function checkUID(req, res, next) {
    const {uid} = req.params;
    db.collection('orders')
    .get()
    .then(querySnapshot => {
        const orders = querySnapshot.docs.map(doc => doc.data());
        const order = orders.find(order => order.userUID === uid);
        if(!order) res.status(400).json({Error: "Invalid UID"});
        else {
            req.order = order;
            next();
        }
    })
}

app.get('/api/order/:uid', checkUID, (req, res) => {
    db.collection('stock')
    .get()
    .then(querySnapshot => {
        const data = querySnapshot.docs.map(doc => doc.data());
        res.json(data);
    })
})

app.post('/api/order/:uid', checkUID, (req, res) => {
    const {cart} = req.body;
    const order = req.order;

    // var updates = {};
    // updates['/orders/' + order.id + '/orderCart/' + order.orderCart.length] = cart;
    // firebase.database().ref().update(updates);

    try {
        order.orderCart = [...order.orderCart, ...cart];
        res.status(201).json({msg: "ORDER ADDED", object: order});
    } catch {
        res.status(400).json({Error: "Invalid UID"});
    }
})

app.listen(port, () => console.log(`Server running on ${port}`));