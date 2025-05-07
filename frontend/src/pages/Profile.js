import React, { useState, useEffect } from "react";
import './tailwind.css';

const ProfilePage = () => {
    const [user, setUser] = useState({
        firstname: "Willliam",
        lastname: "Qiu",
        email: "wqiu8445@uni.sydney.edu.au",
        bio: "Student",
        avatar: "/logo192.png",
        _id: "500483747",
        joinDate: "May 2025",
    });
    const [activeTab, setActiveTab] = useState("editProfile");
    const [isEditing, setIsEditing] = useState(false);
    const [passwords, setPasswords] = useState({ current: "", new: "" });
    const [listings, setListings] = useState([]);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5050/api/oldPhoneDeals/users")
            .then(res => res.json())
            .then(data => {
                const fetched = data[0];
                setUser(prev => ({ ...prev, ...fetched }));
            })
            .catch(err => console.error(err));
    }, []);

    const handleEdit = () => setIsEditing(!isEditing);

    const handleSave = (e) => {
        e.preventDefault();
        setIsEditing(false);
        // Add API call to save user data here
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords((prev) => ({ ...prev, [name]: value }));
    };

    const handleSignOut = () => {
        // Add sign-out logic here
        window.location.href = "/"; // Redirect to Main Page
    };

    const renderEditProfile = () => (
        <div>
            {isEditing ? (
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="form-group">
                        <label className="block text-gray-700 font-medium">First Name:</label>
                        <input
                            type="text"
                            name="firstname"
                            value={user.firstname}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>
                    <div className="form-group">
                        <label className="block text-gray-700 font-medium">Last Name:</label>
                        <input
                            type="text"
                            name="lastname"
                            value={user.lastname}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>
                    <div className="form-group">
                        <label className="block text-gray-700 font-medium">Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>
                    <button
                        className="px-6 py-2 font-semibold text-white bg-cyan-500 rounded-lg shadow-md hover:bg-cyan-600"
                        type="submit"
                    >
                        Update Profile
                    </button>
                </form>
            ) : (
                <div>
                    <button
                        className="px-6 py-2 font-semibold text-white bg-cyan-500 rounded-lg shadow-md hover:bg-cyan-600"
                        onClick={handleEdit}
                    >
                        Edit Profile
                    </button>
                </div>
            )}
        </div>
    );

    const renderChangePassword = () => (
        <form className="space-y-4">
            <div className="form-group">
                <label className="block text-gray-700 font-medium">Current Password:</label>
                <input
                    type="password"
                    name="current"
                    value={passwords.current}
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
                className="px-6 py-2 font-semibold text-white bg-cyan-500 rounded-lg shadow-md hover:bg-cyan-600"
                type="submit"
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
                <p><strong>Bio:</strong> {user.bio}</p>
                <p><strong>Join Date:</strong> {user.joinDate}</p>
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
            </div>
        </div>
    );
};

export default ProfilePage;
