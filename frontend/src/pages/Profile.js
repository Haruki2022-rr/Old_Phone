import React, { useState, useEffect } from "react";
import './tailwind.css';

const ProfilePage = () => {
    const [user, setUser] = useState({
        firstname: "Willliam",
        lastname: "Qiu",
        email: "wqiu8445@uni.sydney.edu.au",
        _id: "500483747",
        password: ""
    });
    
    const [draftUser, setDraftUser] = useState(user);

    const [activeTab, setActiveTab] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [passwords, setPasswords] = useState({ current: user.password, new: "" });
    const [listings, setListings] = useState([]);
    const [comments, setComments] = useState([]);
    
    // Fetch user once on mount
    useEffect(() => {
    fetch("http://localhost:5050/api/oldPhoneDeals/users")
        .then(res => res.json())
        .then(data => {
        const fetched = data[0];
        console.log(fetched);
        setUser(fetched);
        })
        .catch(err => console.error(err));
    }, []);

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

    const handleSave = (e) => {
        e.preventDefault();
        setUser(draftUser);
        setIsEditing(false);
        // TODO: Call API to persist draftUser
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        console.log(user.password);
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        // Check that current password matches before submitting
        if (passwords.current !== user.password) {
            alert("Current password is incorrect");
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(passwords.new)) {
            alert("New password must have at least 8 characters, including a capital letter, a lowercase letter, a number, and a symbol.");
            return;
        }
        /** 
        fetch("http://localhost:5050/api/oldPhoneDeals/users/updatePassword", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: user._id,
                currentPassword: passwords.current,
                newPassword: passwords.new
            })
        })
        .then(res => {
            if (!res.ok) throw new Error('Password update failed');
            return res.json();
        })
        .then(response => {
            setPasswords({ current: "", new: "" });
            alert("Password updated successfully");
            window.location.reload(); // refresh after password change
        })
        .catch(err => {
            console.error(err);
            alert("Error updating password");
        });
        */
        setPasswords({ current: user.password, new: "" });
        alert("Password updated successfully");
        window.location.reload(); // refresh after password change
    };

    const handleSignOut = () => {
        // Add sign-out logic
        window.location.href = "/";
    };

    // Render functions
    const renderEditProfile = () => (
    <div>
        {isEditing ? (
        <form onSubmit={handleSave} className="space-y-4">
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
                type="submit"
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
        <div>
            <button
                className="px-6 py-2 font-semibold text-white bg-cyan-500 rounded-lg shadow-md hover:bg-cyan-600"
                onClick={() => alert("Add Listing")}
            >
                Add Listing
            </button>
            <ul className="mt-4">
                {listings.map((listing, index) => (
                    <li key={index} className="flex justify-between items-center">
                        <span>{listing.title}</span>
                        <div>
                            <button
                                className="px-4 py-2 text-white bg-green-500 rounded-lg shadow-md hover:bg-green-600"
                                onClick={() => alert("Enable/Disable Listing")}
                            >
                                Enable/Disable
                            </button>
                            <button
                                className="px-4 py-2 text-white bg-red-500 rounded-lg shadow-md hover:bg-red-600 ml-2"
                                onClick={() => alert("Remove Listing")}
                            >
                                Remove
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );

    const renderViewComments = () => (
        <ul>
            {comments.map((comment, index) => (
                <li key={index} className="border-b py-2">
                    <p>{comment.text}</p>
                    <button
                        className="text-cyan-500 hover:underline"
                        onClick={() => alert("Hide/Show Comment")}
                    >
                        {comment.hidden ? "Show" : "Hide"}
                    </button>
                </li>
            ))}
        </ul>
    );

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
