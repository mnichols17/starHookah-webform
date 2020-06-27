const express = require('express');
const path = require('path');
const firebase = require('firebase');
const admin = require('firebase-admin');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

const serviceAccount = {
    "type": process.env.TYPE,
    "project_id": process.env.PROJECT_ID,
    "private_key_id": process.env.PRIVATE_KEY_ID,
    "private_key": process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": process.env.CLIENT_EMAIL,
    "client_id": process.env.CLIENT_ID,
    "auth_uri": process.env.AUTH_URL,
    "token_uri": process.env.TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER_CERT,
    "client_x509_cert_url": process.env.CLIENT_CERT_URL
}
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

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
        res.json(querySnapshot.docs.map(doc => doc.data()));
    })
})

app.post('/api/order/:uid', checkUID, (req, res) => {
    const {cart} = req.body;
    const order = req.order;

    order.orderCart = [...order.orderCart, ...cart];
    db.collection("orders").doc(order.id).set(order);
    res.status(201).json({msg: "ORDER ADDED"});
})

app.listen(port, () => console.log(`Server running on ${port}`));