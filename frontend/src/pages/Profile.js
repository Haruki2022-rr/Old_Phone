import React, { useState, useEffect } from "react";

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
            const fetched = data[1];
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
    <div className="profile-container">
        <div className="profile-header">
            <img src={user.avatar} alt="Profile" className="profile-avatar" />
            <h1>
                {user.firstname} {user.lastname}
            </h1>
        </div>

        <div className="profile-content">
            {isEditing ? (
                <form onSubmit={handleSave}>
                    <div className="form-group">
                        <label>First Name:</label>
                        <input
                            type="text"
                            name="firstname"
                            value={user.firstname}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Last Name:</label>
                        <input
                            type="text"
                            name="lastname"
                            value={user.lastname}
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
                        <textarea
                            name="bio"
                            value={user.bio}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>ID:</label>
                        <input
                            type="text"
                            name="_id"
                            value={user._id}
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
                        <strong>ID:</strong> {user._id}
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
