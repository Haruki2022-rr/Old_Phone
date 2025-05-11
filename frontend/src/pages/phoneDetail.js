import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const PhoneDetail = () => {
    const { id } = useParams();
    const [phone, setPhone] = useState(null);
    const [visibleReviews, setVisibleReviews] = useState(3);
    const [quantity, setQuantity] = useState(1);
    const [showQuantityInput, setShowQuantityInput] = useState(false);
    const { cartItems, addToCart } = useContext(CartContext);

    useEffect(() => {
        fetch(`http://localhost:5050/api/oldPhoneDeals/phones/${id}`)
            .then(res => res.json())
            .then(data => setPhone(data))
            .catch(err => console.error('Failed to fetch phone details:', err));
    }, [id]);

    if (!phone) return <div>Loading...</div>;

    const reviewsToShow = phone.reviews?.slice(0, visibleReviews) || [];
    const existingItem = cartItems.find(item => item.phoneId === phone._id);
    const currentCartQty = existingItem ? existingItem.quantity : 0;
    const remainingStock = phone.stock - currentCartQty;

    const handleConfirmAdd = () => {
        if (quantity > remainingStock) {
            alert(`Only ${remainingStock} left in stock.`);
            return;
        }
        addToCart(phone, quantity, phone.price);
        setShowQuantityInput(false);
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
            <img
                src={`http://localhost:5050${phone.image}`}
                alt={phone.title}
                className="mx-auto mb-4 max-h-64"
            />
            <h2 className="text-2xl font-bold mb-2">{phone.title}</h2>
            <p className="text-gray-600 mb-1">Brand: {phone.brand}</p>
            <p className="text-gray-600 mb-1">Price: ${phone.price}</p>
            <p className="text-gray-600 mb-1">Stock: {remainingStock > 0 ? remainingStock : 'Out of stock'}</p>
            <p className="text-gray-600 mb-1">Seller: {phone.seller?.firstname} {phone.seller?.lastname}</p>

            <div className="mt-6">
                {currentCartQty > 0 && (
                    <p className="text-sm text-yellow-600 mb-1">
                        In cart: {currentCartQty}
                    </p>
                )}
                {remainingStock <= 0 ? (
                    <p className="text-sm text-red-500 font-semibold mb-2">
                        Out of stock
                    </p>
                ) : showQuantityInput ? (
                    <div className="flex items-center gap-3">
                        <input
                            type="number"
                            min="1"
                            max={remainingStock}
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            className="border p-2 w-20 rounded"
                        />
                        <button
                            onClick={handleConfirmAdd}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Confirm
                        </button>
                        <button
                            onClick={() => setShowQuantityInput(false)}
                            className="text-red-500 underline text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowQuantityInput(true)}
                        className="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600"
                    >
                        Add to Cart
                    </button>
                )}
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-2">Reviews</h3>
            <div className="space-y-4">
                {reviewsToShow.map((review, index) => (
                    <div
                        key={index}
                        className={`p-3 rounded border ${review.hidden ? 'text-gray-400' : 'text-black'}`}
                    >
                        <p className="font-medium">Rating: {review.rating}/5</p>
                        <p>
                            {review.comment.length > 200
                                ? review.comment.slice(0, 200) + '...'
                                : review.comment}
                        </p>
                    </div>
                ))}
                {phone.reviews?.length > visibleReviews && (
                    <button
                        onClick={() => setVisibleReviews(prev => prev + 3)}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                        Show More
                    </button>
                )}
            </div>
        </div>
    );
};

export default PhoneDetail;
