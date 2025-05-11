import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import axios from "axios";

const CheckoutPage = () => {
    const { cartItems, updateQuantity, removeFromCart, clearCart } = useContext(CartContext);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch current user when component mounts
    useEffect(() => {
        axios.get("http://localhost:5050/api/oldPhoneDeals/auth/currentUser", { withCredentials: true })
            .then(res => {
                setUser(res.data.user);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    // Calculate total cost
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Confirm order and send to backend
    const handleConfirmOrder = async () => {
        if (!user) {
            alert("You must be logged in to confirm the order.");
            return;
        }

        try {
            await axios.post("http://localhost:5050/api/oldPhoneDeals/orders", {
                userId: user._id,
                cartItems: cartItems.map(item => ({
                    phoneId: item.phoneId,
                    quantity: item.quantity,
                    price: item.price,
                })),
                total,
            });

            alert("Order placed successfully!");
            clearCart(); // Clear context state
            localStorage.removeItem("cartItems"); // Clear localStorage manually to ensure sync
        } catch (error) {
            console.error(error);
            alert("Failed to place order.");
        }
    };

    if (loading) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    if (!cartItems.length) {
        return (
            <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md text-center">
                <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
                <p className="text-gray-600">Add some items to checkout!</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

            <div className="mb-6 p-4 border rounded-md bg-gray-50">
                <p className="text-lg font-semibold mb-2">Customer Information:</p>
                <p><strong>Name:</strong> {user.firstname} {user.lastname}</p>
                <p><strong>Email:</strong> {user.email}</p>
            </div>

            <div className="space-y-4">
                {cartItems.map(item => (
                    <div key={item.phoneId} className="flex justify-between items-center border-b pb-2">
                        <div>
                            <p className="font-semibold">{item.title}</p>
                            <p className="text-sm text-gray-600">Price: ${item.price}</p>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <button
                            onClick={() => removeFromCart(item.phoneId)}
                            className="text-red-500 font-semibold hover:underline"
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-6 text-center">
                <h2 className="text-2xl font-bold mb-4">Total: ${total}</h2>
                <button
                    onClick={handleConfirmOrder}
                    className="px-8 py-3 font-semibold text-white bg-cyan-500 rounded-lg shadow-md hover:bg-cyan-600"
                >
                    Confirm Order
                </button>
            </div>
        </div>
    );
};

export default CheckoutPage;
