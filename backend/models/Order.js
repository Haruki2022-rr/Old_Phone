const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    //keep the information of user even user is deleted
    userSnapshot: {
        name: String,
        email: String
    },
    items: [
        {
            phone: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Phone',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            //keep the phone information
            titleSnapshot: String,
            brandSnapshot: String,
        }
    ],
    total: {
        type: Number,
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema, 'orders');
