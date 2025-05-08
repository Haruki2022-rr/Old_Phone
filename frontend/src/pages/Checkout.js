import React, { useState, useEffect } from "react";
import './tailwind.css';

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
            const fetched = data[0];
            console.log(fetched);
            setUser(prev => ({ ...prev, ...fetched }));
        })
        .catch(err => console.error(err));
}, []);