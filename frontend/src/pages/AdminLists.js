import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminLists = ({ listings, setListings, users, reviews,showMessage}) => {
    const [editingListing, setEditingListing] = useState(null);
    const [editListingTitle, setEditListingTitle] = useState('');
    const [editListingBrand, setEditListingBrand] = useState('');
    const [editListingPrice, setEditListingPrice] = useState('');
    const [editListingImage, setEditListingImage] = useState('');
    const [editListingStock, setEditListingStock] = useState('');
    const [viewListingReviews, setViewListingReviews] = useState(null);


    const [searchTerm, setSearchTerm] = useState('');

    const filteredListings = listings.filter(listing => {
        const seller = users.find(u => u._id === listing.seller);
        if (!seller) return null; //if the user is deleted, not display
        const sellerName = seller ? `${seller.firstname} ${seller.lastname}`.toLowerCase() : '';
        return (
            listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            listing.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sellerName.includes(searchTerm.toLowerCase())
        );
    });

    //sorting
    const [sortField, setSortField] = useState('title');
    const [sortOrder, setSortOrder] = useState('asc');

    const sortedListings = [...filteredListings].sort((a, b) => {
        let valA, valB;
        if (sortField === 'price' || sortField === 'stock') {
            valA = parseFloat(a[sortField] || 0);
            valB = parseFloat(b[sortField] || 0);
        } else if (sortField === 'status') {
            valA = a.disabled ? 1 : -1;
            valB = b.disabled ? 1 : -1;
        } else if (sortField === 'seller') {
            const nameA = users.find(u => u._id === a.seller);
            const nameB = users.find(u => u._id === b.seller);
            valA = nameA ? `${nameA.firstname} ${nameA.lastname}`.toLowerCase() : '';
            valB = nameB ? `${nameB.firstname} ${nameB.lastname}`.toLowerCase() : '';
        } else {
            valA = (a[sortField] || '').toLowerCase();
            valB = (b[sortField] || '').toLowerCase();
        }
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    //pagination
    const [currentPage, setCurrentPage] = useState(1);
    const LISTINGS_PER_PAGE = 10;

    const totalPages = Math.ceil(sortedListings.length / LISTINGS_PER_PAGE);
    const paginatedListings = sortedListings.slice(
        (currentPage - 1) * LISTINGS_PER_PAGE,
        currentPage * LISTINGS_PER_PAGE
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const handleEditListing = (e) => {
        e.preventDefault();

        axios.post("/admin/adminEditListing", { listingID: editingListing._id, listingTitle: editListingTitle, listingBrand: editListingBrand,listingImage: editListingImage, listingPrice: editListingPrice, listingStock: editListingStock, actionType: 'edit' })
            .then(response => {
                if (response.status === 200) {
                    alert("Listing updated successfully.");
                    setEditingListing(null);
                    setListings(listings.map(listing =>
                        listing._id === editingListing._id
                            ? { ...listing, title: editListingTitle, brand: editListingBrand, image: editListingImage, price: editListingPrice, stock: editListingStock }
                            : listing
                    ));

                } else {
                    alert(response.data.message || "Failed to update listing.");
                }
            })
            .catch(error => {
                if (error.response) {
                    alert(error.response.data.message);
                } else {
                    alert("An unexpected error occurred.");
                }
            });

        //refresh window

    };

    const handleToggleListingStatus = (listing) => {
        if (window.confirm(`Are you sure you want to toggle status for listing ${listing._id}?`)) {

            axios.post("/admin/adminEditListing", { listingID: listing._id, listingTitle: listing.title, listingBrand: listing.brand, listingImage: listing.image, listingStock: listing.stock, listingPrice: listing.price, listingDisabled: listing.disabled, actionType: 'toggle'})
                .then(response => {
                    if (response.status === 200) {
                        setListings(listings.map(l => l._id === listing._id ? { ...l, disabled: !l.disabled } : l));
                        showMessage(`Listing ${listing._id} status toggled.`, 'success');
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

    const handleDeleteListing = (listing) => {
        if (window.confirm(`Are you sure you want to delete listing ${listing._id}?`)) {

            axios.post("/admin/adminDeleteListing", { listingID: listing._id})
                .then(response => {
                    if (response.status === 200) {
                        showMessage(`Listing ${listing._id} deleted.`, 'success');
                        setListings(listings.filter(l => l._id !== listing._id));

                    } else {
                        alert(response.data.message || "Failed to update listing.");
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
        else {
            showMessage('Listing deletion cancelled.', 'error');
        }

    };

    return (
        <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Listing Management</h2>
            <input
                type="text"
                placeholder="Search listings by title, brand, or seller..."
                className="mb-4 p-2 border border-gray-300 rounded w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    {['title', 'brand', 'price', 'stock', 'status', 'seller'].map(header => (
                        <th
                            key={header}
                            onClick={() => handleSort(header)}
                            className={
                                "text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer px-6 py-3 " +
                                (header === 'title' ? 'w-1/6' :
                                    header === 'brand' ? 'w-1/12' :
                                        header === 'price' ? 'w-1/12' :
                                            header === 'stock' ? 'w-1/12' :
                                                header === 'status' ? 'w-1/12' :
                                                    header === 'seller' ? 'w-1/6' :
                                                        'w-1/3')
                            }
                        >
                            <div className="flex items-center gap-1">
                                <span>{header.charAt(0).toUpperCase() + header.slice(1)}</span>
                                <span className="inline-block w-3">
                                    {sortField === header && (sortOrder === 'asc' ? '▲' : '▼')}
                                </span>
                            </div>
                        </th>
                    ))}
                    <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {paginatedListings.map(listing => {
                    const seller = users.find(user => user._id === listing.seller);
                    const sellerDisplayName = seller ? `${seller.firstname} ${seller.lastname}` : 'Unknown';
                    return (
                        <tr key={listing._id} className={listing.disabled ? 'opacity-60 bg-gray-100' : ''}>
                            <td className="px-6 py-4 text-sm text-gray-900 break-words whitespace-pre-wrap">{listing.title}</td>
                            <td className="px-6 py-4 text-sm text-gray-500 break-words whitespace-pre-wrap">{listing.brand}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">${listing.price}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">{listing.stock}</td>
                            <td className="px-6 py-4 text-sm">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                listing.disabled ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                            }`}>
                                {listing.disabled ? 'Disabled' : 'Active'}
                            </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 break-words whitespace-pre-wrap">{sellerDisplayName}</td>
                            <td className="px-6 py-4 text-sm">
                                <div className="flex flex-wrap items-center gap-3 whitespace-nowrap">
                                    <button
                                        onClick={() => {
                                            setEditingListing(listing);
                                            setEditListingTitle(listing.title);
                                            setEditListingBrand(listing.brand);
                                            setEditListingPrice(listing.price);
                                            setEditListingStock(listing.stock);
                                            setEditListingImage(listing.image);
                                        }}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleToggleListingStatus(listing)}
                                        className="text-yellow-600 hover:text-yellow-900"
                                    >
                                        {listing.disabled ? 'Enable' : 'Disable'}
                                    </button>
                                    <button
                                        onClick={() => handleDeleteListing(listing)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => setViewListingReviews(listing)}
                                        className="text-green-600 hover:text-green-900"
                                    >
                                        Reviews
                                    </button>
                                </div>
                            </td>
                        </tr>
                    );
                })}
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

            {editingListing && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Edit listing</h2>
                        <form onSubmit={handleEditListing}>
                            <div className="mb-4">
                                <label className="block text-gray-700">Title</label>
                                <input
                                    type="text"
                                    value={editListingTitle}
                                    onChange={(e) => setEditListingTitle(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Brand</label>
                                <input
                                    type="text"
                                    value={editListingBrand}
                                    onChange={(e) => setEditListingBrand(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Price</label>
                                <input
                                    type="number"
                                    value={editListingPrice}
                                    onChange={(e) => setEditListingPrice(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Image</label>
                                <input
                                    type="text"
                                    value={editListingImage}
                                    onChange={(e) => setEditListingImage(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Stock</label>
                                <input
                                    type="number"
                                    value={editListingStock}
                                    onChange={(e) => setEditListingStock(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingListing(null)}
                                    className="px-4 py-2 bg-gray-300 rounded"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {viewListingReviews && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-md w-full max-w-lg relative">
                        <button
                            className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                            onClick={() => setViewListingReviews(null)}
                            aria-label="Close"
                        >
                            &times;
                        </button>
                        <h2 className="text-xl font-bold mb-4">
                            Reviews for {viewListingReviews.title}
                        </h2>
                        <div className="overflow-y-auto max-h-[60vh]">
                            {reviews
                                .filter(review => review.listing._id === viewListingReviews._id)
                                .length === 0 ? (
                                <div className="px-4 py-4 text-center text-gray-500">
                                    No reviews found for this listing.
                                </div>
                            ) : (
                                reviews
                                    .filter(review => review.listing._id === viewListingReviews._id)
                                    .map((review, idx) => (
                                        <div key={idx} className="mb-6 border-b pb-4 last:border-b-0 last:pb-0">
                                            <div className="mb-2">
                                                <span className="font-semibold text-gray-700">User: </span>
                                                <span>{review.name}</span>
                                            </div>
                                            <div className="mb-2">
                                                <span className="font-semibold text-gray-700">Rating: </span>
                                                <span>{review.rating}</span>
                                            </div>
                                            <div className="mb-2">
                                                <span className="font-semibold text-gray-700">Visibility: </span>
                                                <span>{review.hidden ? 'Hidden' : 'Visible'}</span>
                                            </div>
                                            <div className="mb-2">
                                                <span className="font-semibold text-gray-700">Comment:</span>
                                                <div className="mt-1 p-2 border rounded bg-gray-50 text-gray-800 break-words">
                                                    {review.comment}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                            )
                            }
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                                onClick={() => setViewListingReviews(null)}
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

export default AdminLists;
