import React, { useState, useEffect } from "react";
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

    useEffect(() => {
        axios.get("/phones")
            .then(res => {
                const fetchedListings = res.data.filter(phone => phone.seller === user._id);
                setListings(fetchedListings);
            })
            .catch(err => console.error(err));
    }, [user._id]);

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

    // TODO: Handle hiding comments
    const handleCommentHiding = (comment) => {
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

    const renderManageListings = () => (
        <div className="space-y-6">
            <button
                className="w-full px-6 py-3 bg-cyan-600 text-white rounded-lg shadow hover:bg-cyan-700 transition duration-200"
                onClick={() => alert("Add Listing")}
            >
                Add Listing
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {listings.map((listing, index) => (
                    <div key={index} className="bg-white rounded-lg shadow p-4 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800">{listing.title}</h3>
                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200"
                                onClick={() => alert("Enable/Disable Listing")}
                            >
                                Enable/Disable
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
                                onClick={() => alert("Remove Listing")}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>
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
                        <button
                            className="px-4 py-2 text-sm font-semibold text-cyan-500 border border-cyan-500 rounded hover:bg-cyan-500 hover:text-white transition duration-200"
                            onClick={() => handleCommentHiding(comment)}
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
                    onClick={() => (window.location.href = "/auth")}
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
