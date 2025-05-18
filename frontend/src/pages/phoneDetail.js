// src/pages/PhoneDetail.js
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';

axios.defaults.baseURL = 'http://localhost:5050/api/oldPhoneDeals';
axios.defaults.withCredentials = true;   // send cookies on every call

export default function PhoneDetail() {
  const { id }       = useParams();
  const nav          = useNavigate();
  const loc          = useLocation();
  const { cartItems, addToCart } = useContext(CartContext);

  /* ------------------------------------------------------------------ */
  /* state                                                               */
  /* ------------------------------------------------------------------ */
  const [phone,   setPhone]   = useState(null);
  const [user,    setUser]    = useState(null);

  // reviews UI helpers
  //const [showCount,       setShowCount]   = useState(3);
  const [expandedIds,     setExpandedIds] = useState(new Set());

  // add-to-cart helpers
  const [qty,             setQty]         = useState(1);
  const [askQty,          setAskQty]      = useState(false);

  // form for new review
  const [newComment,      setNewComment]  = useState('');
  const [newRating,       setNewRating]   = useState(5);

  /* ------------------------------------------------------------------ */
  /* fetches                                                             */
  /* ------------------------------------------------------------------ */

  // fetch phone details
  useEffect(() => { 
    const loadPhone = async () => {
      const { data } = await axios.get(`/phones/${id}`);
      setPhone(data);
    }
    loadPhone();
  }, [id]);

  useEffect(() => {
    axios.get('/auth/currentUser')
         .then(res => setUser(res.data.user))
         .catch(()  => setUser(null));
  }, []);

  if (!phone) return <p className="p-10 text-center">Loading…</p>;

  /* ------------------------------------------------------------------ */
  /* derived values & helpers                                            */
  /* ------------------------------------------------------------------ */
  const isSeller = user && String(user._id) === String(phone.seller?._id);
  const cartLine = cartItems.find(i => i.phoneId === phone._id);
  const cartQty  = cartLine ? cartLine.quantity : 0;
  const stockLeft = phone.stock - cartQty;

  const maySee = rev =>
       !rev.hidden
    || (user && (String(rev.reviewer) === String(user._id) || isSeller));

  const visibleReviews = (phone.reviews || []).filter(maySee);
  const pagedReviews   = visibleReviews;

  const isExpanded = id => expandedIds.has(id);

  const toggleExpand = id =>
    setExpandedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  /* ------------------------------------------------------------------ */
  /* review actions                                                      */
  /* ------------------------------------------------------------------ */
  const submitReview = async () => {
    if (!newComment.trim()) return alert('Comment cannot be empty');

    try {
      const { data } = await axios.post(
        `/phones/${id}/reviews`,
        { rating: newRating, comment: newComment }
      );
      setPhone(p => ({ ...p, reviews: [...p.reviews, data.review] }));
      setNewComment(''); setNewRating(5);
      window.location.reload();
    } catch (err) {
        
      alert(err.response?.data?.error || 'Failed to add review');
    }
  };

  const toggleHidden = async (reviewId) => {
    try {
      const { data } = await axios.post(
        `/phones/${phone._id}/reviews/${reviewId}/toggle` 
      );
      // reload or update locally
      setPhone(p => ({
        ...p,
        reviews: p.reviews.map(r =>
          String(r._id) === reviewId ? { ...r, hidden: data.hidden } : r
        )
      }));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed');
    }
  };


  /* ------------------------------------------------------------------ */
  /* cart actions                                                        */
  /* ------------------------------------------------------------------ */
  const startAdd = () => {
    if (!user) return nav('/auth', { state:{ from: loc }});
    setAskQty(true);
  };

  const confirmAdd = () => {
    if (qty > stockLeft) return alert(`Only ${stockLeft} left`);
    addToCart(phone, qty, phone.price);
    setAskQty(false);
  };

  /* ------------------------------------------------------------------ */
  /* render                                                              */
  /* ------------------------------------------------------------------ */
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">

      {/* -- header + back -- */}
      <button onClick={()=>nav(-1)}
              className="mb-6 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">
        ← Back
      </button>

      {/* -- basic info -- */}
      <img src={`http://localhost:5050${phone.image}`}
           alt={phone.title}
           className="mx-auto mb-4 max-h-64" />
      <h2 className="text-2xl font-bold mb-2">{phone.title}</h2>
      <p className="text-gray-600">Brand: {phone.brand}</p>
      <p className="text-gray-600">Price: ${phone.price}</p>
      <p className="text-gray-600">
        Stock: {stockLeft > 0 ? stockLeft : 'Out of stock'}
      </p>
      <p className="text-gray-600 mb-6">
        Seller: {phone.seller?.firstname} {phone.seller?.lastname}
      </p>

      {/* -- cart section -- */}
      {stockLeft > 0 ? (
        askQty ? (
          <div className="flex items-center gap-3 mb-6">
            <input type="number" min="1" max={stockLeft}
                   value={qty} onChange={e=>setQty(+e.target.value)}
                   className="border p-2 w-24 rounded" />
            <button onClick={confirmAdd}
                    className="bg-green-500 text-white px-4 py-2 rounded">
              Add
            </button>
            <button onClick={()=>setAskQty(false)}
                    className="underline text-sm">Cancel</button>
          </div>
        ) : (
          <button onClick={startAdd}
                  className="bg-cyan-500 text-white px-4 py-2 rounded mb-6">
            Add to Cart
          </button>
        )
      ) : (
        <p className="text-red-500 font-semibold mb-6">Out of stock</p>
      )}

      {/* -- reviews -- */}
      <h3 className="text-xl font-semibold mb-3">Reviews</h3>

      {pagedReviews.map(r => {
        const owned = user && ( String(r.reviewer) === String(user._id) );
        const canToggle = owned || isSeller;

        const long   = r.comment.length > 200;
        const cut    = r.comment.slice(0,200);
        const showAll = isExpanded(r._id);

        return (
          <div key={r._id}
               className={`border p-3 mb-4 rounded
                          ${r.hidden ? 'text-gray-400' : 'text-black'}`}>
            <p className="font-medium">Rating: {r.rating}/5</p>
            <p className="whitespace-pre-wrap">
              { long ? (showAll ? r.comment : cut + '…') : r.comment }
            </p>
                {long && (
                    <button
                        onClick={() => toggleExpand(r._id)}
                        className="text-sm text-blue-600 underline mt-1"
                    >
                        {showAll ? 'Show less' : 'Show more'}
                    </button>
                    )}
    

            {user && (user._id === r.reviewer || user._id === phone.seller?._id) && (
                 <button
                    onClick={() => toggleHidden(r._id)}
                    className="text-sm text-red-500 underline ml-2"
                  >
                    {r.hidden ? 'Unhide' : 'Hide'}
                  </button>
                )}
          </div>
        );
      })}

      {visibleReviews.length === 0 && (
        <p className="mb-6">No reviews yet.</p>
      )}

      
      {/* --------- add review form --------- */}
      {user && (
        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-2">Add a review</h3>
          <textarea
            rows="3"
            value={newComment}
            onChange={e=>setNewComment(e.target.value)}
            placeholder="Write your comment here…"
            className="w-full p-2 border rounded mb-2"
          />
          <div className="flex items-center gap-3 mb-4">
            <label>Rating:</label>
            <select value={newRating}
                    onChange={e=>setNewRating(+e.target.value)}
                    className="border p-2 rounded">
              {[1,2,3,4,5].map(n=> <option key={n}>{n}</option>)}
            </select>
          </div>
          <button onClick={submitReview}
                  className="bg-green-500 text-white px-4 py-2 rounded">
            Submit review
          </button>
        </div>
      )}
    </div>
  );
}
