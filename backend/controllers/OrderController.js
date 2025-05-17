const Order = require('../models/Order');
const Phone = require('../models/Phone');
const User = require('../models/User');

// createOrder
exports.createOrder = async (req, res) => {
    try {
        const { userId, cartItems, total } = req.body;

        if (!userId || !cartItems || cartItems.length === 0 || total == null) {
            return res.status(400).json({ message: 'Invalid order' });
        }

        //get the user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'user not valid' });
        }

        const order = new Order({
            user: userId,
            // keep the snapshot
            userSnapshot: {
                name: `${user.firstname} ${user.lastname}`,
                email: user.email
            },

            items: cartItems.map(item => ({
                phone: item.phoneId,
                quantity: item.quantity,
                price: item.price,
                titleSnapshot: item.title,
                brandSnapshot: item.brand,
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

// GET all orders (admin)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'firstname lastname email')
            .populate('items.phone', 'title price image');
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
};

// GET one order by ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'firstname lastname email')
            .populate('items.phone', 'title price image');

        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch order' });
    }
};

// GET all orders by user
exports.getOrdersByUser = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.userId })
            .populate('items.phone', 'title price image');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch orders for user' });
    }
};