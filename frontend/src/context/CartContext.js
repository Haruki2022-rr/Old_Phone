import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    const addToCart = (phone, quantity, price) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.phoneId === phone._id);
            if (existingItem) {
                // If the phone is in cart, add to its original quantity.
                return prevItems.map(item =>
                    item.phoneId === phone._id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                return [...prevItems, { phoneId: phone._id, title: phone.title, quantity, price }];
            }
        });
    };

    // update quantity
    const updateQuantity = (phoneId, quantity) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.phoneId === phoneId ? { ...item, quantity } : item
            )
        );
    };

    // remove an item from the cart
    const removeFromCart = (phoneId) => {
        setCartItems(prevItems => prevItems.filter(item => item.phoneId !== phoneId));
    };

    // clear cart
    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};
