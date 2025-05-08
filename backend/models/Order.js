const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
            }
        }
    ],
    total: {
        type: Number,
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema, 'orders');
