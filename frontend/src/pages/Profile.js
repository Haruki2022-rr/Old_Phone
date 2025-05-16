import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import './tailwind.css';



const ProfilePage = () => {
    const [user, setUser] = useState({
        firstname: "",
        lastname: "",
        email: "",
        _id: "",
        password: ""
    });
    
    const navigate = useNavigate();
    const loc = useLocation();

    const [draftUser, setDraftUser] = useState(user);
    const [hiddenPassword, setHiddenPassword] = useState({
        password: ""
    });

    const [activeTab, setActiveTab] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [passwords, setPasswords] = useState({ current: user.password, new: "" });
    const [listings, setListings] = useState([]);
    const [comments, setComments] = useState([]);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [showAddListingForm, setShowAddListingForm] = useState(false);
    const [commentDetails, setCommentDetails] = useState([]);
    
    // Fetch user once on mount
    useEffect(() => {
    axios.get("/auth/currentUser")
        .then(res => {
            const fetched = res.data.user;
            console.log(fetched);
            setUser(fetched);
        })
        .catch(err => console.error(err));
    }, []);

    // Fetch user listings once on mount
    useEffect(() => {
        axios.get("/phones")
            .then(res => {
                const fetchedListings = res.data.filter(phone => phone.seller === user._id);
                setListings(fetchedListings);
            })
            .catch(err => console.error(err));
    }, [user._id]);

    // Fetch user comments once on mount
    useEffect(() => {
        axios.get("/phones")
            .then(res => {
                const fetchedComments = res.data;
                const userComments = [];
                const details = [];
                fetchedComments.forEach(comment => {
                    comment.reviews.forEach(review => {
                        if (review.reviewer === user._id) {
                            userComments.push(review);
                            details.push(comment);
                        }
                    });
                });
                setComments(userComments);
                setCommentDetails(details);
            })
            .catch(err => console.error(err));
        
    }, [user._id, comments.length]);



    // Sync draft with official user whenever it changes
    useEffect(() => {
        setDraftUser(user);
    }, [user]);
    

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setDraftUser(user);
    };

    const handleDraftChange = (e) => {
        const { name, value } = e.target;
        setDraftUser(prev => ({ ...prev, [name]: value }));
    };

    const handleHiddenPasswordChange = (e) => {
        const { name, value } = e.target;
        setHiddenPassword(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = (e) => {
        e.preventDefault();

        if (!hiddenPassword.password) {
            alert("Please enter a password.");
            return;
        }

        axios.post("/auth/updateProfile", { userDetails: draftUser, hiddenPassword: hiddenPassword })
            .then(response => {
                if (response.status === 200) {
                    alert("Profile updated successfully.");
                    draftUser.password = ""; // Clear password field after saving
                    hiddenPassword.password = ""; // Clear hidden password field
                    setUser(draftUser);
                    setIsEditing(false);
                    setShowPasswordConfirm(false);
                    
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
    };



    const handleListingRemoval = (listing) => {
        axios.post("/auth/removeListing", { listingId: listing._id })
            .then(response => {
                if (response.status === 200) {
                    alert("Listing removed successfully.");
                    setListings(prev => prev.filter(item => item._id !== listing._id));
                } else {   
                    alert(response.data.message || "Failed to remove listing.");
                }
            })
    };

    const handleListingEnabling = (listing) => {
        axios.post("/auth/updateListing", { listingId: listing._id })
            .then(response => {
                if (response.status === 200) {
                    alert("Listing updated successfully.");
                    setListings(prev => prev.map(item => item._id === listing._id ? { ...item, disabled: !item.disabled } : item));
                } else {   
                    alert(response.data.message || "Failed to update listing.");
                }
            })
    }

    // TODO: Handle hiding comments
    const handleCommentHiding = (comment, commentDetails) => {
        console.log(comment, commentDetails);
        axios.post("/auth/hideComment", { comment: comment.reviewer, commentDetails: commentDetails })
            .then(response => {
                if (response.status === 200) {
                    alert("Comment updated successfully.");
                    setComments(prev => prev.map(item => item._id === comment._id ? { ...item, hidden: !item.hidden } : item));
                } else {   
                    alert(response.data.message || "Failed to update comment.");
                }
            })
        

    };
        


    const handlePasswordChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        // Check that current password matches before submitting

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(passwords.new)) {
            alert("New password must have at least 8 characters, including a capital letter, a lowercase letter, a number, and a symbol.");
            return;
        }

        axios.post("/auth/updatePassword", {
            currentPassword: passwords.current,
            newPassword: passwords.new,
            email: user.email
        })
        .then(response => {
            if (response.status === 200) {
                alert(response.data.message);
                window.location.reload();
            } else {
                alert(response.data.message || "Failed to update password.");
            }
        })
        .catch(error => {
            if (error.response) {
                alert(error.response.data.message);
            } else {
                alert("An unexpected error occurred.");
            }
        });
        


         // refresh after password change
    };

    const handleSignOut = () => {
        axios.post("/auth/logout")
            .then(() => {
                alert("You have been signed out.");
                window.location.href = "/";
            })
            .catch(err => {
                console.error(err);
                alert("Error signing out. Please try again.");
            });
    };

    // Render functions
    // Note: Add the following state in your component alongside the other useState hooks:
    // const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const renderEditProfile = () => (
        <div>
            {isEditing ? (
            <>
                {!showPasswordConfirm ? (
                <form className="space-y-4">
                    <div className="form-group">
                    <label className="block text-gray-700 font-medium">First Name:</label>
                    <input
                        type="text"
                        name="firstname"
                        value={draftUser.firstname}
                        onChange={handleDraftChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    </div>
                    <div className="form-group">
                    <label className="block text-gray-700 font-medium">Last Name:</label>
                    <input
                        type="text"
                        name="lastname"
                        value={draftUser.lastname}
                        onChange={handleDraftChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    </div>
                    <div className="form-group">
                    <label className="block text-gray-700 font-medium">Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={draftUser.email}
                        onChange={handleDraftChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    </div>
                    <div className="flex space-x-2">
                    <button
                        type="button"
                        onClick={() => setShowPasswordConfirm(true)}
                        className="px-6 py-2 font-semibold text-white bg-cyan-500 rounded-lg shadow-md hover:bg-cyan-600"
                    >
                        Update Profile
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-6 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    </div>
                </form>
                ) : (
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="form-group">
                    <label className="block text-gray-700 font-medium">Enter Password:</label>
                    <input
                        type="password"
                        name="password"
                        value={hiddenPassword.password}
                        onChange={handleHiddenPasswordChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    </div>
                    <div className="flex space-x-2">
                    <button
                        type="submit"
                        className="px-6 py-2 font-semibold text-white bg-cyan-500 rounded-lg shadow-md hover:bg-cyan-600"
                    >
                        Confirm Update
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowPasswordConfirm(false)}
                        className="px-6 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300"
                    >
                        Back
                    </button>
                    </div>
                </form>
                )}
            </>
            ) : (
            <button
                onClick={handleEdit}
                className="px-6 py-2 font-semibold text-white bg-cyan-500 rounded-lg shadow-md hover:bg-cyan-600"
            >
                Edit Profile
            </button>
            )}
        </div>
        );

    const renderChangePassword = () => (
    <form onSubmit={handlePasswordSubmit} className="space-y-4">
        <div className="form-group">
        <label className="block text-gray-700 font-medium">Current Password:</label>
        <input
            type="password"
            name="current"
            onChange={handlePasswordChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        </div>
        <div className="form-group">
        <label className="block text-gray-700 font-medium">New Password:</label>
        <input
            type="password"
            name="new"
            value={passwords.new}
            onChange={handlePasswordChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        </div>
        <button
        type="submit"
        className="px-6 py-2 font-semibold text-white bg-cyan-500 rounded-lg shadow-md hover:bg-cyan-600"
        >
        Change Password
        </button>
    </form>
    );

    
    const [newListing, setNewListing] = useState({
        title: "",
        brand: "",
        image: "",
        stock: "",
        price: ""
    });

    const handleNewListingChange = (e) => {
        const { name, value } = e.target;
        setNewListing(prev => ({ ...prev, [name]: value }));
    };

    const handleAddListingSubmit = (e) => {
        e.preventDefault();
        // Replace the URL and data handling as necessary for your backend API.
        axios.post("/auth/addListing", newListing)
            .then(response => {
                if (response.status === 200) {
                    alert("Listing added successfully.");
                    // Add the new listing to listings array
                    setListings(prev => [...prev, response.data.listing]);
                    setNewListing({ title: "", brand: "", image: "", stock: "", price: "" });
                    setShowAddListingForm(false);
                } else {
                    alert(response.data.message || "Failed to add listing.");
                }
            })
            .catch(error => {
                console.error(error);
                alert("An unexpected error occurred.");
            });
    };

    const [selectedListing, setSelectedListing] = useState(null);

    const handleListingClick = (listing) => {
        setSelectedListing(listing);
    };

    const renderListingDetails = () => {
        if (!selectedListing) return null;
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-lg w-full">
                    <button
                        onClick={() => setSelectedListing(null)}
                        className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                    >
                        X
                    </button>
                    <h3 className="text-xl font-bold mb-4">{selectedListing.title}</h3>
                    <p className="mb-2"><strong>Brand:</strong> {selectedListing.brand}</p>
                    <p className="mb-2"><strong>Price:</strong> ${selectedListing.price}</p>
                    <p className="mb-2"><strong>Stock:</strong> {selectedListing.stock}</p>
                    <img
                        src={`http://localhost:5050${selectedListing.image}`}
                        alt={selectedListing.title}
                        className="w-full mt-4 rounded"
                    />
                </div>
            </div>
        );
    };

    const renderManageListings = () => (
        <div className="space-y-6">
            <button
                className="w-full px-6 py-3 bg-cyan-600 text-white rounded-lg shadow hover:bg-cyan-700 transition duration-200"
                onClick={() => setShowAddListingForm(true)}
            >
                Add Listing
            </button>
            {showAddListingForm && (
                <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Add New Listing</h3>
                    <form onSubmit={handleAddListingSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700">Title:</label>
                            <input
                                type="text"
                                name="title"
                                value={newListing.title}
                                onChange={handleNewListingChange}
                                className="w-full px-4 py-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Brand:</label>
                            <input
                                type="text"
                                name="brand"
                                value={newListing.brand}
                                onChange={handleNewListingChange}
                                className="w-full px-4 py-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Image URL:</label>
                            <input
                                type="text"
                                name="image"
                                value={newListing.image}
                                onChange={handleNewListingChange}
                                className="w-full px-4 py-2 border rounded"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Stock:</label>
                            <input
                                type="number"
                                name="stock"
                                value={newListing.stock}
                                onChange={handleNewListingChange}
                                className="w-full px-4 py-2 border rounded"
                                min="0"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Price:</label>
                            <input
                                type="number"
                                name="price"
                                value={newListing.price}
                                onChange={handleNewListingChange}
                                className="w-full px-4 py-2 border rounded"
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>
                        <div className="flex space-x-2">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Submit
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowAddListingForm(false)}
                                className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {listings.map((listing, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg shadow p-4 border border-gray-200 cursor-pointer hover:shadow-lg transition duration-200 flex flex-col justify-between"
                        onClick={() => handleListingClick(listing)}
                    >
                        <h3 className="text-lg font-semibold text-gray-800">{listing.title}</h3>
                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleListingEnabling(listing);
                                }}
                            >
                                {listing.disabled ? "Enable" : "Disable"}
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleListingRemoval(listing);
                                }}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {renderListingDetails()}
        </div>
    );

    const renderViewComments = () => (
        <div className="space-y-4">
            {comments.map((comment, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-4 border hover:shadow-lg transition duration-200">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {commentDetails[index].title}
                    </h2>
                    <p className="text-sm text-gray-600">
                        Brand: {commentDetails[index].brand}
                    </p>
                    <p className="mt-2 text-gray-700">{comment.comment}</p>
                    <div className="flex items-center justify-between mt-4">
                        <span className="text-yellow-500 font-bold">
                            Rating: {comment.rating}
                        </span>
                        <span className="text-gray-500">
                            {comment.hidden ? "(Hidden)" : ""}
                        </span>

                        <button
                            className="px-4 py-2 text-sm font-semibold text-cyan-500 border border-cyan-500 rounded hover:bg-cyan-500 hover:text-white transition duration-200"
                            onClick={() => handleCommentHiding(comment, commentDetails[index])}
                        >
                            {comment.hidden ? "Show" : "Hide"}
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );

    if (!user || !user._id) {
        return (
            <div className="profile-container max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
                <h1 className="font-bold text-3xl text-gray-800">Profile</h1>
                <p className="text-gray-500 mt-4">You must be signed in to view this page.</p>
                <button
                    className="px-6 py-2 font-semibold text-white bg-cyan-500 rounded-lg shadow-md hover:bg-cyan-600 mt-4"
                    onClick={() => navigate("/auth", { state: { from: loc } })}
                >
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <div className="profile-container max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <div className="profile-header flex items-center justify-between">
                <h1 className="font-bold text-3xl text-gray-800">Profile</h1>
                <button
                    className="px-6 py-2 font-semibold text-white bg-red-500 rounded-lg shadow-md hover:bg-red-600"
                    onClick={handleSignOut}
                >
                    Sign Out
                </button>
            </div>
            <div className="user-stats text-gray-700 mt-6">
                <p><strong>Full Name:</strong> {user.firstname} {user.lastname}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>User ID:</strong> {user._id}</p>
            </div>
            <div className="tabs mt-6 flex flex-col space-y-4">
                <button
                    className={`px-4 py-2 ${activeTab === "editProfile" ? "bg-cyan-500 text-white" : "bg-gray-200"}`}
                    onClick={() => setActiveTab("editProfile")}
                >
                    Edit Profile
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === "changePassword" ? "bg-cyan-500 text-white" : "bg-gray-200"}`}
                    onClick={() => setActiveTab("changePassword")}
                >
                    Change Password
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === "manageListings" ? "bg-cyan-500 text-white" : "bg-gray-200"}`}
                    onClick={() => setActiveTab("manageListings")}
                >
                    Manage Listings
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === "viewComments" ? "bg-cyan-500 text-white" : "bg-gray-200"}`}
                    onClick={() => setActiveTab("viewComments")}
                >
                    View Comments
                </button>
            </div>
            <div className="tab-content mt-6">
                {activeTab === "editProfile" && renderEditProfile()}
                {activeTab === "changePassword" && renderChangePassword()}
                {activeTab === "manageListings" && renderManageListings()}
                {activeTab === "viewComments" && renderViewComments()}
                {!activeTab && <p className="text-gray-500">Please select a tab to view its contents.</p>}
            </div>
        </div>
    );
};

export default ProfilePage;
