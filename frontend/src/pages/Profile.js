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
useEffect(() => {
    fetch("http://localhost:5050/api/oldPhoneDeals/users")
        .then(res => res.json())
        .then(data => {
        // assume data is an array and you want the first element
            const fetched = data[0];
            console.log(fetched);
        // merge it into your state (or just replace it if shapes match)
            setUser(prev => ({ ...prev, ...fetched }));
        })
        .catch(err => console.error(err));
    }, []);

const [isEditing, setIsEditing] = useState(false);

const handleEdit = () => {
    setIsEditing(!isEditing);
};

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

return (
    <div className=" max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg ">
        <div className=" flex items-center space-x-6">
            <img
                src={user.avatar}
                alt="Profile"
                className="profile-avatar w-24 h-24 rounded-full border-2 border-cyan-500"
            />
            <h1 className="font-bold text-3xl text-gray-800">
                {user.firstname} {user.lastname}
            </h1>
        </div>

        <div className="profile-content mt-6">
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
                    <div className="form-group">
                        <label className="block text-gray-700 font-medium">Bio:</label>
                        <textarea
                            name="bio"
                            value={user.bio}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>
                    <div className="form-group">
                        <label className="block text-gray-700 font-medium">ID:</label>
                        <input
                            type="text"
                            name="_id"
                            value={user._id}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                    </div>
                    <button
                        className="px-6 py-2 font-semibold text-white bg-cyan-500 rounded-lg shadow-md hover:bg-cyan-600"
                        type="submit"
                    >
                        Save
                    </button>
                </form>
            ) : (
                <div className="profile-info space-y-4">
                    <p className="text-gray-700">
                        <strong className="font-medium">Email:</strong> {user.email}
                    </p>
                    <p className="text-gray-700">
                        <strong className="font-medium">Bio:</strong> {user.bio}
                    </p>
                    <p className="text-gray-700">
                        <strong className="font-medium">ID:</strong> {user._id}
                    </p>
                    <p className="text-gray-700">
                        <strong className="font-medium">Member since:</strong> {user.joinDate}
                    </p>
                    <button
                        className="px-6 py-2 font-semibold text-white bg-cyan-500 rounded-lg shadow-md hover:bg-cyan-600"
                        onClick={handleEdit}
                    >
                        Edit Profile
                    </button>
                </div>
            )}
        </div>
    </div>
);
};

export default ProfilePage;
