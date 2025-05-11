const Order = require('../models/Order');
const Phone = require('../models/Phone');
// createOrder
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

        for (const item of cartItems) {
            const phone = await Phone.findById(item.phoneId);

            if (!phone) {
                console.warn(`Phone not found for ID: ${item.phoneId}`);
                continue; // skip if phone not found
            }

            const newStock = Math.max(0, phone.stock - item.quantity);
            phone.stock = newStock;
            await phone.save();
        }

        res.status(201).json({ message: 'Order created successfully', order: savedOrder });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
