import React, { useState } from "react";

const ProfilePage = () => {
const [user, setUser] = useState({
    name: "Willliam Qiu",
    email: "wqiu8445@uni.sydney.edu.au",
    bio: "Student",
    avatar: "/logo192.png",
    location: "Sydney, AU",
    joinDate: "May 2025",
});

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
    <div className="profile-container">
        <div className="profile-header">
            <img src={user.avatar} alt="Profile" className="profile-avatar" />
            <h1>{user.name}</h1>
        </div>

    <div className="profile-content">
        {isEditing ? (
            <form onSubmit={handleSave}>
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Bio:</label>
                    <textarea name="bio" value={user.bio} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Location:</label>
                    <input
                        type="text"
                        name="location"
                        value={user.location}
                        onChange={handleChange}
                    />
                </div>
            <button type="submit">Save</button>
            </form>
        ) : (
            <div className="profile-info">
                <p>
                    <strong>Email:</strong> {user.email}
                </p>
                <p>
                    <strong>Bio:</strong> {user.bio}
                </p>
                <p>
                    <strong>Location:</strong> {user.location}
                </p>
                <p>
                    <strong>Member since:</strong> {user.joinDate}
                </p>
                <button onClick={handleEdit}>Edit Profile</button>
            </div>
            )}
        </div>
    </div>
    );
};

export default ProfilePage;
