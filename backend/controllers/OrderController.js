const Order = require('../models/Order');

// create new order
exports.createOrder = async (req, res) => {
    try {
        const { userId, cartItems, total } = req.body;

        if (!userId || !cartItems || cartItems.length === 0 || total == null) {
            return res.status(400).json({ message: 'Invalid order' });
        }

        const order = new Order({
            user: userId,
            items: cartItems.map(item => ({
                phone: item.phoneId,
                quantity: item.quantity,
                price: item.price,
            })),
            total,
        });

        const savedOrder = await order.save();

        res.status(201).json({ message: 'Order created successfully', order: savedOrder });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
