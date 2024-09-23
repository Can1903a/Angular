const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser'); 
require('dotenv').config();
const Iyzipay = require('iyzipay');


const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

const iyzipay = new Iyzipay({
    apiKey: process.env.IYZICO_API_KEY,
    secretKey: process.env.IYZICO_SECRET_KEY,
    uri: process.env.IYZICO_BASE_URL
});

app.post('/api/payment', (req, res) => {
    const { price, paidPrice, currency, basketId, paymentCard, buyer, shippingAddress, billingAddress, basketItems } = req.body;

    const request = {
        locale: Iyzipay.LOCALE.TR,
        conversationId: '123456789',
        price: price,
        paidPrice: paidPrice,
        currency: currency,
        installment: '1',
        basketId: basketId,
        paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
        paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
        paymentCard: paymentCard,
        buyer: buyer,
        shippingAddress: shippingAddress,
        billingAddress: billingAddress,
        basketItems: basketItems
    };

    iyzipay.payment.create(request, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }
        res.status(200).json(result);
    });
});

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});