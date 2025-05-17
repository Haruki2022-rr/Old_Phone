import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminReviews = ({ reviews, setReviews, showMessage }) => {

    const [reviewSearchTerm, setReviewSearchTerm] = useState('');
    const [selectedReview, setSelectedReview] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const filteredReviews = reviews.filter ( (review =>
        review.listing && //filter review without listing.
        (review.name.toLowerCase().includes(reviewSearchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(reviewSearchTerm.toLowerCase()) ||
        review.listing.title.toLowerCase().includes(reviewSearchTerm.toLowerCase()) ||
        review.listing._id.toLowerCase().includes(reviewSearchTerm.toLowerCase()) ||
        review.reviewer.toLowerCase().includes(reviewSearchTerm.toLowerCase()))
    ));

    //sorting
    const [sortField, setSortField] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');

    const sortedReviews = [...filteredReviews].sort((a, b) => {
        let valA, valB;

        if (sortField === 'hidden') {
            valA = a.hidden ? 1 : 0;
            valB = b.hidden ? 1 : 0;
        } else if (sortField === 'listing') {
            valA = a.listing.title.toLowerCase();
            valB = b.listing.title.toLowerCase();
        } else {
            valA = (a[sortField] || '').toLowerCase();
            valB = (b[sortField] || '').toLowerCase();
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };



    //pagination
    const [currentPage, setCurrentPage] = useState(1);
    const REVIEWS_PER_PAGE = 10;

    const totalPages = Math.ceil(sortedReviews.length / REVIEWS_PER_PAGE);
    const paginatedReviews = sortedReviews.slice(
        (currentPage - 1) * REVIEWS_PER_PAGE,
        currentPage * REVIEWS_PER_PAGE
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);



    const handleToggleReviewVisibility = (review) => {
        if (window.confirm(`Are you sure you want to toggle status for ${review.name}'s review?`)) {

            axios.post("/admin/adminEditListing", { listingID: review.listing._id, listingTitle: review.listing.title, listingBrand: review.listing.brand, listingImage: review.listing.image, listingStock: review.listing.stock, listingPrice: review.listing.price, listingReview: review,actionType: 'toggleReview' })
                .then(response => {
                    if (response.status === 200) {
                        setReviews(reviews.map(r => r === review ? { ...r, hidden: !r.hidden } : r));
                        showMessage(`Review by ${review.name} visibility toggled.`, 'success');
                        console.log(response.data.listing)
                    } else {
                        alert(response.data.message || "Failed to update listing status.");
                    }
                })
                .catch(error => {
                    if (error.response) {
                        alert(error.response.data.message);
                    } else {
                        alert("An unexpected error occurred.");
                    }
                });

        }
    };

    useEffect(() => {
        if (!selectedReview) return;
        const handleKeyDown = (e) => {
            if (e.key === "Escape") setSelectedReview(null);
        };
        const handleClickOutside = (e) => {
            // Only close if click is on the overlay (not inside modal)
            if (e.target.classList.contains("bg-black") && e.target.classList.contains("bg-opacity-50")) {
                setSelectedReview(null);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("mousedown", handleClickOutside);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("mousedown", handleClickOutside);
        };
    }, [selectedReview]);

    return (<section>
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Review & Comment Moderation</h2>
        <input
            type="text"
            placeholder="Search reviews by user, listing, or comment..."
            className="mb-4 p-2 border border-gray-300 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={reviewSearchTerm}
            onChange={(e) => setReviewSearchTerm(e.target.value)}
        />
            <div className="overflow-x-auto">
                <table className="min-w-full table-fixed bg-white border border-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        {['name', 'listing', 'comment', 'hidden'].map(header => (
                            <th
                                key={header}
                                className={
                                    "text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer " +
                                    (header === 'name'
                                        ? 'w-1/6 px-4 py-3'
                                        : header === 'listing'
                                            ? 'w-1/4 px-4 py-3'
                                            : header === 'comment'
                                                ? 'w-2/6 px-4 py-3'
                                                : 'w-1/6 px-4 py-3')
                                }
                                onClick={() => handleSort(header)}
                            >
                                {header === 'name'
                                    ? 'User'
                                    : header === 'listing'
                                        ? 'Listing'
                                        : header === 'hidden'
                                            ? 'Visibility'
                                            : header.charAt(0).toUpperCase() + header.slice(1)}
                                <span className="inline-block w-3">
                                    {sortField === header && (sortOrder === 'asc' ? '▲' : '▼')}
                                </span>
                            </th>
                        ))}
                        <th className="w-1/6 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedReviews.map(review => (
                        <tr key={review._id} className="hover:bg-gray-50">
                            <td className="px-4 py-4 text-sm text-gray-900 break-words whitespace-pre-wrap">
                                {review.name}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900 break-words whitespace-pre-wrap">
                                {review.listing.title}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900 break-words whitespace-pre-wrap">
                                {review.comment}
                            </td>
                            <td className="px-4 py-4 text-sm">
                            <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                review.hidden ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                            }`}
                            >
                                {review.hidden ? 'Hidden' : 'Visible'}
                            </span>
                            </td>
                            <td className="px-4 py-4 text-sm font-medium">
                                <button onClick={() => handleToggleReviewVisibility(review)}
                                        className="text-blue-600 hover:text-blue-900">
                                    {review.hidden ? 'Show' : 'Hide'}
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>


                <div className="flex items-center justify-center gap-4 mt-6">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded ${
                            currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                     </span>

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded ${
                            currentPage === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                    >
                        Next
                    </button>
                </div>
            </div>

            {selectedReview && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-md w-full max-w-lg relative">
                        <button
                            className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                            onClick={() => setSelectedReview(null)}
                            aria-label="Close"
                        >
                            &times;
                        </button>
                        <h2 className="text-xl font-bold mb-4">Review Details</h2>
                        <div className="mb-2">
                            <span className="font-semibold text-gray-700">User: </span>
                            <span>{selectedReview.name}</span>
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold text-gray-700">Listing: </span>
                            <span>{selectedReview.listing.title}</span>
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold text-gray-700">Rating: </span>
                            <span>{selectedReview.rating}</span>
                        </div>
                        <div className="mb-2">
                            <span className="font-semibold text-gray-700">Visibility: </span>
                            <span>{selectedReview.hidden ? 'Hidden' : 'Visible'}</span>
                        </div>
                        <div className="mb-4">
                            <span className="font-semibold text-gray-700">Comment:</span>
                            <div className="mt-1 p-2 border rounded bg-gray-50 text-gray-800 break-words">
                                {selectedReview.comment}
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                                onClick={() => setSelectedReview(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
    </section>
    );
};

export default AdminReviews;