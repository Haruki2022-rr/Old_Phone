import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const PhoneDetail = () => {
  const { id } = useParams();
  const [phone, setPhone] = useState(null);
  const [visibleReviews, setVisibleReviews] = useState(3);

  useEffect(() => {
    fetch(`http://localhost:5050/api/oldPhoneDeals/phones/${id}`)
      .then(res => res.json())
      .then(data => setPhone(data))
      .catch(err => console.error('Failed to fetch phone details:', err));
  }, [id]);

  if (!phone) return <div>Loading...</div>;

  const reviewsToShow = phone.reviews?.slice(0, visibleReviews) || [];

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
      <p className="text-gray-600 mb-1">Stock: {phone.stock}</p>
      <p className="text-gray-600 mb-1">Seller: {phone.seller?.firstname} {phone.seller?.lastname}</p>

      {/* Reviews Section */}
      <h3 className="text-xl font-semibold mt-6 mb-2">Reviews</h3>
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
