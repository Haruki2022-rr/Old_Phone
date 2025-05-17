import React, { useState, useEffect } from 'react';
import axios from "axios";
import './tailwind.css';

import AdminUsers from './AdminUsers';
import AdminLists from "./AdminLists";
import AdminReviews from "./AdminReviews";
import AdminLogs from "./AdminLogs";
import AdminSales from "./AdminSales";


const AdminMain = () => {

    // Placeholder for success/error messages

    const [message, setMessage] = useState({ text: '', type: '' }); // type: 'success' or 'error'

    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 4000);
    };


    useEffect(() => {
        axios.get("/admin/me")
            .then(res => {
                console.log(res.data);
            })
            .catch(err => {
                console.error(err);
                window.location.href = "/"; // Redirect to home page
            });
    }, []);

    let initialTab = localStorage.getItem('adminActiveTab');
    if (!initialTab) initialTab = 'users';
    const [activeTab, setActiveTab] = useState(initialTab);

    useEffect(() => {
        localStorage.setItem('adminActiveTab', activeTab);
    }, [activeTab]);

    // review and listing depend on user.
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (activeTab === 'users') {
            axios.get("/users")
                .then(res => {
                    setUsers(res.data);
                })
                .catch(err => console.error(err));
        }
    }, [activeTab]);

    // review depended on user and listing.
    const [listings, setListings] = useState([]);
    const [reviews, setReviews] = useState([]);
    useEffect(() => {
        if(activeTab === 'users' || activeTab === 'listings' || activeTab === 'reviews') {
            axios.get("/phones")
                .then(res => {
                    setListings(res.data);
                    const allListings = res.data;
                    axios.get("/users")
                        .then(usersRes => {
                            setUsers(usersRes.data);
                            const allReviews = [];
                            allListings.forEach(listing => {
                                if (listing.reviews && Array.isArray(listing.reviews)) {
                                    listing.reviews.forEach(review => {
                                        const reviewerUser = usersRes.data.find(u => u._id === review.reviewer);
                                        const reviewerName = reviewerUser ? `${reviewerUser.firstname} ${reviewerUser.lastname}` : 'Unknown User';
                                        allReviews.push({
                                            reviewer: review.reviewer,
                                            rating: review.rating,
                                            comment: review.comment,
                                            hidden: review.hidden,
                                            name: reviewerName,
                                            listing: listing
                                        });
                                    });
                                }
                            });
                            setReviews(allReviews);
                        });
                })
                .catch(err => console.error(err));
        }
    }, [activeTab]);

    const [sales, setSales] = useState([]);
    //fetch latest order every 10 seconds
    useEffect(() => {
        const fetchOrders = () => {
            axios.get("/orders")
                .then(res => {
                    const sortedOrders = res.data.sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    );
                    setSales(sortedOrders);
                })
                .catch(err => console.error("Failed to fetch orders:", err));
        };

        fetchOrders(); // call this first when loading the page.
        const interval = setInterval(fetchOrders, 10000);

        return () => clearInterval(interval); //
    }, []);

    const [adminLogs, setAdminLogs] = useState([]);

    //fetch admin Logs when switch to adminLog tab
    useEffect(() => {
        if (activeTab === 'adminLogs') {
            axios.get("/admin/adminLogs")
                .then(res => {
                    const sortedLogs = res.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                    setAdminLogs(sortedLogs);
                })
                .catch(err => console.error("Failed to fetch admin logs:", err));
        }
    }, [activeTab]);

    const TabButton = ({ tabName, label }) => (
        <button
            className={`px-4 py-2 mr-2 mb-2 rounded-t-lg focus:outline-none transition-colors duration-150 ease-in-out
                  ${activeTab === tabName
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            onClick={() => setActiveTab(tabName)}
        >
            {label}
        </button>
    );



    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <header className="mb-6">
                <h1 className="text-4xl font-bold text-gray-800 text-center">Admin Dashboard</h1>
            </header>

            {message.text && (
                <div className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-50 p-3 rounded-md text-white shadow-lg ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {message.text}
                </div>
            )}

            <nav className="flex flex-wrap border-b border-gray-300">
                <TabButton tabName="users" label="User Management" />
                <TabButton tabName="listings" label="Listing Management" />
                <TabButton tabName="reviews" label="Review Moderation" />
                <TabButton tabName="sales" label="Sales & Activity" />
                <TabButton tabName="adminLogs" label="Admin operation log" />
            </nav>

            <main className="mt-1 p-6 bg-white shadow-lg rounded-b-lg">
                {activeTab === 'users' && <AdminUsers
                    users={users}
                    setUsers={setUsers}
                    listings={listings}
                    reviews={reviews}
                    showMessage={showMessage}
                />}

                {activeTab === 'listings' && <AdminLists
                        listings={listings}
                        setListings={setListings}
                        users={users}
                        reviews={reviews}
                        showMessage={showMessage}
                    />}

                {activeTab === 'reviews' && (
                    <AdminReviews
                        reviews={reviews}
                        setReviews={setReviews}
                        showMessage={showMessage}
                    />
                )}

                {activeTab === 'sales' && (
                    <AdminSales sales={sales} showMessage={showMessage} />
                )}

                {activeTab === 'adminLogs' && (
                    <AdminLogs adminLogs={adminLogs} />
                )}
            </main>
            <footer className="mt-8 text-center text-sm text-gray-500">
                <p>Admin page</p>
            </footer>

        </div>
    );
};

export default AdminMain;