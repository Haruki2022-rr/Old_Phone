import React, { useState, useEffect } from 'react';
import axios from "axios";
import './tailwind.css';




//
// const mockSalesData = [
//   { id: 's1', timestamp: '2023-10-26 11:00 AM', buyerId: 'u3', buyerName: 'Charlie Chaplin', items: [{ listingId: 'l1', name: 'Vintage iPhone X', qty: 1 }], total: 250 },
//   { id: 's2', timestamp: '2023-10-25 03:00 PM', buyerId: 'u1', buyerName: 'Alice Wonderland', items: [{ listingId: 'l2', name: 'Refurbished Galaxy S10', qty: 1 }], total: 180 },
// ];

const AdminMain = () => {
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('adminActiveTab') || 'users');

  useEffect(() => {
    localStorage.setItem('adminActiveTab', activeTab);
  }, [activeTab]);
  
  // Data states
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [sales, setSales] = useState([]);

  // Search and filter states
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [listingSearchTerm, setListingSearchTerm] = useState('');
  const [reviewSearchTerm, setReviewSearchTerm] = useState('');

  const [editingUser, setEditingUser] = useState(null);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editID, setEditID] = useState('');

  const [editingListing, setEditingListing] = useState(null);
  const [editListingTitle, setEditListingTitle] = useState('');
  const [editListingBrand, setEditListingBrand] = useState('');
  const [editListingPrice, setEditListingPrice] = useState('');
  const [editListingImage, setEditListingImage] = useState('');
  const [editListingStock, setEditListingStock] = useState('');




  // Filtered data
  const filteredUsers = users.filter(user => {
    const searchTermLower = userSearchTerm.toLowerCase();
    const fullNameLower = `${user.firstname || ''} ${user.lastname || ''}`.toLowerCase(); // Handle potential null/undefined
    const emailLower = (user.email || '').toLowerCase(); // Handle potential null/undefined

    return fullNameLower.includes(searchTermLower) || emailLower.includes(searchTermLower);
  });

  const filteredListings = listings.filter(listing =>
    listing.title.toLowerCase().includes(listingSearchTerm.toLowerCase()) ||
    listing.brand.toLowerCase().includes(listingSearchTerm.toLowerCase())
  );

  const filteredReviews = reviews.filter(review =>
    review.name.toLowerCase().includes(reviewSearchTerm.toLowerCase()) ||
    review.comment.toLowerCase().includes(reviewSearchTerm.toLowerCase()) ||
    review.listing.title.toLowerCase().includes(reviewSearchTerm.toLowerCase())
  );
  

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

  useEffect(() => {
    axios.get("/users")
        .then(res => {
            setUsers(res.data);
        })
        .catch(err => console.error(err));
    }, []);

    useEffect(() => {
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
    }, []);

    useEffect(() => {
        axios.get("/orders", { withCredentials: true })
            .then(res => setSales(res.data))
            .catch(err => console.error('Failed to fetch orders:', err));
    }, []);





    // Placeholder for success/error messages
  const [message, setMessage] = useState({ text: '', type: '' }); // type: 'success' or 'error'

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  // Action Handlers (placeholders - implement API calls and state updates)
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
  /** 
  const handleViewReviews = (userID) => {
    const userReviews = listings.flatMap(listing =>
      listing.reviews ? listing.reviews.filter(review => review.reviewer === userID).map(review => ({
        listingTitle: listing.title,
        content: review.comment,
      })) : []
    );
    if (userReviews.length > 0) {
      const reviewsText = userReviews
        .map(item => `Listing: ${item.listingTitle}\nReview: ${item.content}`)
        .join("\n\n");
      alert(`User Reviews:\n\n${reviewsText}`);
    } else {
      alert("This user has no reviews.");
    }
  }
    */


  const handleDeleteUser = (userId) => {
    if (userId === 'superadmin_id_placeholder') { // Prevent deleting super admin (not required anymore)
        showMessage('Cannot delete the super admin account.', 'error');

        return;
    }
    if (window.confirm('Are you sure you want to delete user ' + userId + '? This action cannot be undone.')) {
      setUsers(users.filter(u => u._id !== userId));
      showMessage(`User ${userId} deleted.`, 'success');
    }
  };

  const handleEditListing = (e) => {
      e.preventDefault();

      axios.post("/admin/adminEditListing", { listingID: editingListing._id, listingTitle: editListingTitle, listingBrand: editListingBrand,listingImage: editListingImage, listingPrice: editListingPrice, listingStock: editListingStock })
              .then(response => {
                  if (response.status === 200) {
                      alert("Listing updated successfully.");
                      setEditingListing(null);
                      setListings(listings.map(listing =>
                        listing._id === editingListing._id
                          ? { ...listing, title: editListingTitle, brand: editListingBrand, image: editListingImage, price: editListingPrice, stock: editListingStock }
                          : listing
                      ));
                      
                  } else {
                      alert(response.data.message || "Failed to update listing.");
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

  const handleToggleListingStatus = (listing) => {
    if (window.confirm(`Are you sure you want to toggle status for listing ${listing._id}?`)) {

      axios.post("/admin/adminEditListing", { listingID: listing._id, listingTitle: listing.title, listingBrand: listing.brand, listingImage: listing.image, listingStock: listing.stock, listingPrice: listing.price, listingDisabled: listing.disabled })
              .then(response => {
                  if (response.status === 200) {
                      setListings(listings.map(l => l._id === listing._id ? { ...l, disabled: !l.disabled } : l));
                      showMessage(`Listing ${listing._id} status toggled.`, 'success');
                  } else {
                      alert(response.data.message || "Failed to update listing status.");
                  }
              })
              .catch(error => {
                  if (error.response) {
                      alert(error.response.data.message);
                  } else {
                      alert("An unexpected error occurred.");
                  }
              });
      
    }
  };

  const handleDeleteListing = (listing) => {
    if (window.confirm(`Are you sure you want to delete listing ${listing._id}?`)) {

      axios.post("/admin/adminDeleteListing", { listingID: listing._id})
                .then(response => {
                    if (response.status === 200) {
                        showMessage(`Listing ${listing._id} deleted.`, 'success');
                        setListings(listings.filter(l => l._id !== listing._id));
                        
                    } else {
                        alert(response.data.message || "Failed to update listing.");
                    }
                })
                .catch(error => {
                    if (error.response) {
                        alert(error.response.data.message);
                    } else {
                        alert("An unexpected error occurred.");
                    }
                });
    } 
    else {
      showMessage('Listing deletion cancelled.', 'error');
    }

  };

  /** 
  const handleViewListings = (userID) => {
    const userListings = listings.filter(listing => listing.seller === userID);
    if (userListings.length === 0) {
      alert("This user has no listings.");
    } else {
      const listingsInfo = userListings
        .map(listing => `Title: ${listing.title}\nBrand: ${listing.brand}\nPrice: $${listing.price}\nStock: ${listing.stock}`)
        .join("\n\n");
      alert(`Listings for this user:\n\n${listingsInfo}`);
    }
  };
  */

/** 
  const handleViewListingReviews = (listing) => {
    const listingReviews = reviews.filter(review => review.listing.title === listing.title);
    if (listingReviews.length === 0) {
      alert("This listing has no reviews.");
    } else {
      const reviewsInfo = listingReviews
        .map(review => `User: ${review.name}\nRating: ${review.rating}\nComment: ${review.comment}`)
        .join("\n\n");
      alert(`Reviews for this listing:\n\n${reviewsInfo}`);
    }
  }
*/
  



  const handleToggleReviewVisibility = (review) => {
    if (window.confirm(`Are you sure you want to toggle status for ${review.name}'s review?`)) {

      axios.post("/admin/adminEditListing", { listingID: review.listing._id, listingTitle: review.listing.title, listingBrand: review.listing.brand, listingImage: review.listing.image, listingStock: review.listing.stock, listingPrice: review.listing.price, listingReview: review })
              .then(response => {
                  if (response.status === 200) {
                      setReviews(reviews.map(r => r === review ? { ...r, hidden: !r.hidden } : r));
                      showMessage(`Review by ${review.name} visibility toggled.`, 'success');
                      console.log(response.data.listing)
                  } else {
                      alert(response.data.message || "Failed to update listing status.");
                  }
              })
              .catch(error => {
                  if (error.response) {
                      alert(error.response.data.message);
                  } else {
                      alert("An unexpected error occurred.");
                  }
              });
      
    }
    
  };

    //export when click export button
    const handleExportSales = (format) => {
        if (!sales || sales.length === 0) {
            alert("no sales data to export");
            return;
        }

        //click 'Export as Json' button
        if (format === 'JSON') {
            const jsonString = JSON.stringify(sales, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = "sales_record.json";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }

        //click 'Export as CSV' button
        if (format === 'CSV') {
            const headers = ["Timestamp", "Buyer", "Items", "Total"];
            const rows = sales.map(sale => {
                const timestamp = new Date(sale.createdAt).toLocaleString();
                const buyer = sale.user ? `${sale.user.firstname} ${sale.user.lastname}` : "N/A";
                const items = sale.items.map(item =>
                    `${item.phone?.title || 'Unknown'} (Qty: ${item.quantity})`
                ).join("; ");
                const total = sale.total.toFixed(2);
                return [timestamp, buyer, items, total];
            });

            const csvContent = [headers, ...rows]
                .map(row => row.map(val => `"${val}"`).join(","))
                .join("\n");

            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = "sales_record.csv";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }

        alert(`Sales data export completed as ${format}.`);
    };




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

  // States for popups
  const [selectedReview, setSelectedReview] = useState(null);
  const [userReviews, setUserReviews] = useState(null);
  const [userListings, setUserListings] = useState(null);
  const [viewListingReviews, setViewListingReviews] = useState(null);

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

  useEffect(() => {
    if (!viewListingReviews) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setViewListingReviews(null);
    };
    const handleClickOutside = (e) => {
      // Only close if click is on the overlay (not inside modal)
      if (e.target.classList.contains("bg-black") && e.target.classList.contains("bg-opacity-50")) {
        setViewListingReviews(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [viewListingReviews]);

  useEffect(() => {
    if (!selectedReview) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelectedReview(null);
    };
    const handleClickOutside = (e) => {
      // Only close if click is on the overlay (not inside modal)
      if (e.target.classList.contains("bg-black") && e.target.classList.contains("bg-opacity-50")) {
        setSelectedReview(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedReview]);



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
      </nav>

      <main className="mt-1 p-6 bg-white shadow-lg rounded-b-lg">
        {activeTab === 'users' && (
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
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['Full Name', 'Email', 'Last Login', 'Actions'].map(header => (
                      <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map(user => (
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
                        <button onClick={() => handleDeleteUser(user._id)} className="text-red-600 hover:text-red-900 mr-3">
                          Delete
                        </button>
                        <button onClick={() => setUserListings(user)} className="text-green-600 hover:text-green-900 mr-3">
                          Listings
                        </button>
                        <button onClick={() => setUserReviews(user)} className="text-purple-600 hover:text-purple-900">
                          Reviews
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'listings' && (
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Listing Management</h2>
            <input
              type="text"
              placeholder="Search listings by title or brand..."
              className="mb-4 p-2 border border-gray-300 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={listingSearchTerm}
              onChange={(e) => setListingSearchTerm(e.target.value)}
            />
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['Title', 'Brand', 'Price', 'Stock', 'Status', 'Seller', 'Actions'].map(header => (
                      <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredListings.map(listing => {
                    const seller = users.find(user => user._id === listing.seller);
                    const sellerDisplayName = seller ? `${seller.firstname} ${seller.lastname}` : 'Unknown Seller';
                    return (
                      <tr key={listing._id} className={`hover:bg-gray-50 ${listing.disabled ? 'opacity-60 bg-gray-300' : ''}`}>
                        <td
                          className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                          title={listing.title}
                        >
                          {listing.title.length > 30 ? `${listing.title.substring(0, 40)}...` : listing.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{listing.brand}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${listing.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{listing.stock}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              listing.disabled ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {listing.disabled ? 'Disabled' : 'Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sellerDisplayName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => {
                              // Open modal with existing user data
                              
                              setEditingListing(listing);
                              setEditListingTitle(listing.title);
                              setEditListingBrand(listing.brand);
                              setEditListingPrice(listing.price);
                              setEditListingStock(listing.stock);
                              setEditListingImage(listing.image);
                            }}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                            Edit
                          </button>
                          <button onClick={() => handleToggleListingStatus(listing)} className="text-yellow-600 hover:text-yellow-900 mr-3">
                            {listing.disabled ? 'Enable' : 'Disable'}
                          </button>
                          <button onClick={() => handleDeleteListing(listing)} className="text-red-600 hover:text-red-900 mr-3">
                            Delete
                          </button>
                          <button onClick={() => setViewListingReviews(listing)} className="text-green-600 hover:text-green-900">
                            Reviews
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                        </tbody>
                      </table>
                    </div>
                  </section>
                )}
        {activeTab === 'reviews' && (
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Review & Comment Moderation</h2>
            <input
              type="text"
              placeholder="Search reviews by user, listing, or comment..."
              className="mb-4 p-2 border border-gray-300 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={reviewSearchTerm}
              onChange={(e) => setReviewSearchTerm(e.target.value)}
            />
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {/* Make columns for name and listing narrow, comment wide */}
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32 max-w-xs truncate">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48 max-w-sm truncate">
                      Listing
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-auto">
                      Comment
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                      Visibility
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReviews.map(review => (
                    <tr
                      key={review._id}
                      className={`hover:bg-gray-50 ${!review.hidden ? 'opacity-100 bg-gray-100' : 'opacity-40 bg-gray-300'} cursor-pointer`}
                      onClick={() => setSelectedReview(review)}
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate" title={review.name}>
                        {review.name}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 max-w-sm truncate" title={review.listing.title}>
                        {review.listing.title}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 max-w-2xl break-words" title={review.comment}>
                        {review.comment.length > 120 ? (
                          <>
                            {review.comment.slice(0, 120)}...
                          </>
                        ) : review.comment}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            review.hidden ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800' 
                          }`}
                        >
                          {review.hidden ? 'Hidden' : 'Visible'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium" onClick={e => e.stopPropagation()}>
                        <button onClick={() => handleToggleReviewVisibility(review)} className="text-blue-600 hover:text-blue-900">
                          {review.hidden ? 'Show' : 'Hide'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeTab === 'sales' && (
            <section>
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Sales and Activity Logs</h2>
                <div className="mb-4 flex space-x-2">
                    <button
                        onClick={() => handleExportSales('CSV')}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors duration-150 ease-in-out"
                    >
                        Export as CSV
                    </button>
                    <button
                        onClick={() => handleExportSales('JSON')}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-150 ease-in-out"
                    >
                        Export as JSON
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            {['Timestamp', 'Buyer', 'Items Purchased', 'Total Amount'].map(header => (
                                <th key={header}
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {header}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {sales.map(sale => (
                            <tr key={sale._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(sale.createdAt)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {sale.user ? `${sale.user.firstname} ${sale.user.lastname}` : 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {sale.items.map(item =>
                                        `${item.phone?.title || 'Unknown'} (Qty: ${item.quantity})`
                                    ).join(', ')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ${sale.total.toFixed(2)}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-6 p-4 border border-gray-200 rounded bg-gray-50">
                    <h3 className="text-lg font-semibold mb-2 text-gray-700">Recent Activity / Notifications</h3>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        <li>
                            Order #{sales[0]?._id.slice(-4)} placed by
                            {' '}
                            {sales[0]?.user ? `${sales[0].user.firstname} ${sales[0].user.lastname}` : 'Unknown'} for
                            {' '}
                            {sales[0]?.items[0]?.phone?.title || 'an item'} on
                            {' '}
                            {formatDate(sales[0]?.createdAt)}.
                        </li>
                        <li>
                            User '{users[users.length - 1]?.firstname} {users[users.length - 1]?.lastname}'
                            ({users[users.length - 1]?.email}) registered on{' '}
                            {formatDate(users[users.length - 1]?.createdAt)}.
                        </li>
                        <li>
                            Listing '{listings[0]?.title}' received a new review on{' '}
                            {formatDate(reviews.find(r => r.phoneId === listings[0]?._id)?.createdAt)}.
                        </li>
                    </ul>
                </div>
            </section>
        )}
      </main>
        <footer className="mt-8 text-center text-sm text-gray-500">
            <p>Admin page</p>
        </footer>

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
      {editingListing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit listing</h2>
            <form onSubmit={handleEditListing}>
              <div className="mb-4">
                <label className="block text-gray-700">Title</label>
                <input
                  type="text"
                  value={editListingTitle}
                  onChange={(e) => setEditListingTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Brand</label>
                <input
                  type="text"
                  value={editListingBrand}
                  onChange={(e) => setEditListingBrand(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Price</label>
                <input
                  type="number"
                  value={editListingPrice}
                  onChange={(e) => setEditListingPrice(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Image</label>
                <input
                  type="text"
                  value={editListingImage}
                  onChange={(e) => setEditListingImage(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Stock</label>
                <input
                  type="number"
                  value={editListingStock}
                  onChange={(e) => setEditListingStock(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setEditingListing(null)}
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
      {viewListingReviews && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-lg relative">
            <button
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={() => setViewListingReviews(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">
              Reviews for {viewListingReviews.title}
            </h2>
            <div className="overflow-y-auto max-h-[60vh]">
              {reviews
                .filter(review => review.listing._id === viewListingReviews._id)
                .length === 0 ? (
                  <div className="px-4 py-4 text-center text-gray-500">
                    No reviews found for this listing.
                  </div>
                ) : (
                  reviews
                    .filter(review => review.listing._id === viewListingReviews._id)
                    .map((review, idx) => (
                      <div key={idx} className="mb-6 border-b pb-4 last:border-b-0 last:pb-0">
                        <div className="mb-2">
                          <span className="font-semibold text-gray-700">User: </span>
                          <span>{review.name}</span>
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
                onClick={() => setViewListingReviews(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedReview && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-lg relative">
            <button
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={() => setSelectedReview(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Review Details</h2>
            <div className="mb-2">
              <span className="font-semibold text-gray-700">User: </span>
              <span>{selectedReview.name}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-700">Listing: </span>
              <span>{selectedReview.listing.title}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-700">Rating: </span>
              <span>{selectedReview.rating}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-700">Visibility: </span>
              <span>{selectedReview.hidden ? 'Hidden' : 'Visible'}</span>
            </div>
            <div className="mb-4">
              <span className="font-semibold text-gray-700">Comment:</span>
                <div className="mt-1 p-2 border rounded bg-gray-50 text-gray-800 break-words">
                {selectedReview.comment}
                </div>
            </div>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={() => setSelectedReview(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMain;