const express = require('express');
const path = require('path');
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
    storageBucket: "gs://starhookah-1e4ce.appspot.com"
});
const db = admin.firestore();
const bucket = admin.storage().bucket();

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

app.get('/api/image/:item', (req, res) => {
    bucket.getFiles((err, files) => {
        if (!err) {
            const file = files.find(file => {
                return file.name.split('/')[1] === req.params.item
            })
            if(file) {
                const config = {
                    action: 'read',
                    expires: '03-17-2025'
                };
                file.getSignedUrl(config, (err, url) => {
                    if (err) {
                        return;
                    }
                    res.json(url)
                });
            }
        }
    });
})

app.get('/api/order/:uid', checkUID, (req, res) => {
    db.collection('stock')
    .get()
    .then(querySnapshot => {
        res.json({items: querySnapshot.docs.map(doc => doc.data())});
    })
})

app.post('/api/order/:uid', checkUID, (req, res) => {
    const {cart} = req.body;
    let order = req.order;

    order.orderCart = [...order.orderCart, ...cart];
    db.collection("orders").doc(order.id).set(order);
    res.status(201).json({msg: "ORDER ADDED"});
})

if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}

app.listen(port, () => console.log(`Server running on ${port}`));