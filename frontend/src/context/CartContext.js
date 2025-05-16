import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // Initialize cart from localStorage if it exists, otherwise use empty array
    const [cartItems, setCartItems] = useState(() => {
        const stored = localStorage.getItem('cartItems');
        return stored ? JSON.parse(stored) : [];
    });

    // Update localStorage whenever cartItems changes
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    // Add a phone to the cart
    const addToCart = (phone, quantity, price) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.phoneId === phone._id);
            if (existingItem) {
                // If the phone is already in cart, increase its quantity
                return prevItems.map(item =>
                    item.phoneId === phone._id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                // Add new item to cart
                return [...prevItems, { phoneId: phone._id, title: phone.title, quantity, price }];
            }
        });
    };

    // Update quantity of a specific item
    const updateQuantity = (phoneId, quantity) => {
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.phoneId === phoneId ? { ...item, quantity } : item
            )
        );
    };

    // Remove an item from the cart
    const removeFromCart = (phoneId) => {
        setCartItems(prevItems => prevItems.filter(item => item.phoneId !== phoneId));
    };

    // Clear the entire cart
    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
};
