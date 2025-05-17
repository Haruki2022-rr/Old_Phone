import React, { useState, useEffect } from 'react';
import axios from 'axios';

const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    try {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch (error) {
        console.error("Error formatting date:", error);
        return 'Invalid Date';
    }
};

const AdminUsers = ({ users, setUsers, listings, reviews, showMessage }) => {
    const [userSearchTerm, setUserSearchTerm] = useState('');

    const [editingUser, setEditingUser] = useState(null);
    const [editFirstName, setEditFirstName] = useState('');
    const [editLastName, setEditLastName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editID, setEditID] = useState('');

    const [userListings, setUserListings] = useState(null);
    const [userReviews, setUserReviews] = useState(null);


    const filteredUsers = users.filter(user => {
        const searchTermLower = userSearchTerm.toLowerCase();
        const fullNameLower = `${user.firstname || ''} ${user.lastname || ''}`.toLowerCase(); // Handle potential null/undefined
        const emailLower = (user.email || '').toLowerCase(); // Handle potential null/undefined
        const userIDLower = (user._id || '').toLowerCase(); // Handle potential null/undefined

        return fullNameLower.includes(searchTermLower) || emailLower.includes(searchTermLower) || userIDLower.includes(searchTermLower);
    });

    //Sorting
    const [sortField, setSortField] = useState('fullname');
    const [sortOrder, setSortOrder] = useState('asc');

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        let valA, valB;

        if (sortField === 'fullname') {
            valA = `${a.firstname || ''} ${a.lastname || ''}`.toLowerCase();
            valB = `${b.firstname || ''} ${b.lastname || ''}`.toLowerCase();
        } else if (sortField === 'lastLogin' || sortField === 'createdAt') {
            valA = new Date(a.lastLogin || 0);
            valB = new Date(b.lastLogin || 0);
        } else {
            valA = (a[sortField] || '').toString().toLowerCase();
            valB = (b[sortField] || '').toString().toLowerCase();
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


    // Pagination

    const [currentPage, setCurrentPage] = useState(1);
    const USERS_PER_PAGE = 10;
    const totalPages = Math.ceil(sortedUsers.length / USERS_PER_PAGE);
    const paginatedUsers = sortedUsers.slice(
        (currentPage - 1) * USERS_PER_PAGE,
        currentPage * USERS_PER_PAGE
    );

    useEffect(() => {
        setCurrentPage(1); // 重置到第一页
    }, [userSearchTerm]);



    const handleEditUser = (e) => {
        e.preventDefault();


        axios.post("/admin/adminUpdateUser", { userID: editID, userFirst: editFirstName, userLast: editLastName, userEmail: editEmail })
            .then(response => {
                if (response.status === 200) {
                    alert("Profile updated successfully.");
                    setEditingUser(null);
                    setUsers(users.map(user =>
                        user._id === editID
                            ? { ...user, firstname: editFirstName, lastname: editLastName, email: editEmail }
                            : user
                    ));

                } else {
                    alert(response.data.message || "Failed to update profile.");
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

    const handleDeleteUser = (userId) => {
        if (userId === 'superadmin_id_placeholder') { // Prevent deleting super admin (not required anymore)
            showMessage('Cannot delete the super admin account.', 'error');

            return;
        }
        if (window.confirm('Are you sure you want to delete user ' + userId + '? This action cannot be undone.')) {
            axios.post("/admin/adminDeleteUser", { userID: userId })
                .then(response => {
                    if (response.status === 200) {
                        showMessage(`User ${userId} deleted.`, 'success');
                    } else {
                        alert(response.data.message || "Failed to delete user.");
                    }
                })
                .catch(error => {
                    if (error.response) {
                        alert(error.response.data.message);
                    } else {
                        alert("An unexpected error occurred.");
                    }
                });
            setUsers(users.filter(u => u._id !== userId));
            showMessage(`User ${userId} deleted.`, 'success');
        }
    };

    useEffect(() => {
        if (!userListings) return;
        const handleKeyDown = (e) => {
            if (e.key === "Escape") setUserListings(null);
        };
        const handleClickOutside = (e) => {
            // Only close if click is on the overlay (not inside modal)
            if (e.target.classList.contains("bg-black") && e.target.classList.contains("bg-opacity-50")) {
                setUserListings(null);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("mousedown", handleClickOutside);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("mousedown", handleClickOutside);
        };
    }, [userListings]);

    useEffect(() => {
        if (!userReviews) return;
        const handleKeyDown = (e) => {
            if (e.key === "Escape") setUserReviews(null);
        };
        const handleClickOutside = (e) => {
            // Only close if click is on the overlay (not inside modal)
            if (e.target.classList.contains("bg-black") && e.target.classList.contains("bg-opacity-50")) {
                setUserReviews(null);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("mousedown", handleClickOutside);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("mousedown", handleClickOutside);
        };
    }, [userReviews]);

    return (
        <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">User Management</h2>
            <input
                type="text"
                placeholder="Search users by name or email..."
                className="mb-4 p-2 border border-gray-300 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
            />
            <div className="overflow-x-auto">
                <table className="min-w-full table-fixed bg-white border border-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        {['fullname', 'email', 'lastLogin'].map((header) => (
                            <th
                                key={header}
                                onClick={() => handleSort(header)}
                                className={
                                    "cursor-pointer text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3 " +
                                    (header === 'fullname' ? 'w-1/5' :
                                        header === 'email' ? 'w-1/4' :
                                            'w-1/5')  // lastLogin
                                }
                            >
                                {header === 'fullname' ? 'Full Name' :
                                    header === 'lastLogin' ? 'Last Login' :
                                        header.charAt(0).toUpperCase() + header.slice(1)}
                                {sortField === header && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
                            </th>
                        ))}
                        <th className="w-2/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>

                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedUsers.map(user => (
                        <tr key={user._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {user.firstname} {user.lastname}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(user.lastLogin)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                    onClick={() => {
                                        // Open modal with existing user data
                                        setEditingUser(user);
                                        setEditFirstName(user.firstname);
                                        setEditLastName(user.lastname);
                                        setEditEmail(user.email);
                                        setEditID(user._id);
                                    }}
                                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                                >
                                    Edit
                                </button>
                                <button onClick={() => handleDeleteUser(user._id)}
                                        className="text-red-600 hover:text-red-900 mr-3">
                                    Delete
                                </button>
                                <button onClick={() => setUserListings(user)}
                                        className="text-green-600 hover:text-green-900 mr-3">
                                    Listings
                                </button>
                                <button onClick={() => setUserReviews(user)}
                                        className="text-purple-600 hover:text-purple-900">
                                    Reviews
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded ${
                            currentPage === 1
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                    >
                        Previous
                    </button>

                    Page {currentPage} of {totalPages}
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded ${
                            currentPage === totalPages
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                    >
                        Next
                    </button>
                </div>
            </div>
            {editingUser && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Edit User</h2>
                        <form onSubmit={handleEditUser}>
                            <div className="mb-4">
                                <label className="block text-gray-700">First Name</label>
                                <input
                                    type="text"
                                    value={editFirstName}
                                    onChange={(e) => setEditFirstName(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Last Name</label>
                                <input
                                    type="text"
                            value={editLastName}
                            onChange={(e) => setEditLastName(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => setEditingUser(null)}
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
            {userListings && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-md w-full max-w-lg relative">
                        <button
                            className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                            onClick={() => setUserListings(null)}
                            aria-label="Close"
                        >
                            &times;
                        </button>
                        <h2 className="text-xl font-bold mb-4">
                            Listings for {userListings.firstname} {userListings.lastname}
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {listings.filter(listing => listing.seller === userListings._id).length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-4 text-center text-gray-500">
                                            No listings found for this user.
                                        </td>
                                    </tr>
                                ) : (
                                    listings
                                        .filter(listing => listing.seller === userListings._id)
                                        .map(listing => (
                                            <tr key={listing._id}>
                                                <td className="px-4 py-2">{listing.title}</td>
                                                <td className="px-4 py-2">{listing.brand}</td>
                                                <td className="px-4 py-2">${listing.price}</td>
                                                <td className="px-4 py-2">{listing.stock}</td>
                                            </tr>
                                        ))
                                )}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                                onClick={() => setUserListings(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {userReviews && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-md w-full max-w-lg relative">
                        <button
                            className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl"
                            onClick={() => setUserReviews(null)}
                            aria-label="Close"
                        >
                            &times;
                        </button>
                        <h2 className="text-xl font-bold mb-4">
                            Reviews for {userReviews.firstname} {userReviews.lastname}
                        </h2>
                        <div className="overflow-y-auto max-h-[60vh]">
                            {reviews
                                .filter(review => review.reviewer === userReviews._id)
                                .length === 0 ? (
                                <div className="px-4 py-4 text-center text-gray-500">
                                    No reviews found for this user.
                                </div>
                            ) : (
                                reviews
                                    .filter(review => review.reviewer === userReviews._id)
                                    .map((review, idx) => (
                                        <div key={idx} className="mb-6 border-b pb-4 last:border-b-0 last:pb-0">
                                            <div className="mb-2">
                                                <span className="font-semibold text-gray-700">Listing: </span>
                                                <span>{review.listing.title}</span>
                                            </div>
                                            <div className="mb-2">
                                                <span className="font-semibold text-gray-700">Brand: </span>
                                                <span>{review.listing.brand}</span>
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
                                onClick={() => setUserReviews(null)}
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

export default AdminUsers;