import React, { useState, useEffect } from 'react';
import axios from "axios";
import './tailwind.css';



const mockReviewsData = [
  { id: 'r1', userId: 'u1', userName: 'Alice Wonderland', content: 'Great phone, fast shipping!', listingId: 'l1', listingTitle: 'Vintage iPhone X', visible: true },
  { id: 'r2', userId: 'u3', userName: 'Charlie Chaplin', content: 'Okay for the price, battery life could be better.', listingId: 'l3', listingTitle: 'Pixel 5 - Like New', visible: false },
  { id: 'r3', userId: 'u2', userName: 'Bob The Builder', content: 'Excellent condition.', listingId: 'l1', listingTitle: 'Vintage iPhone X', visible: true },
];

const mockSalesData = [
  { id: 's1', timestamp: '2023-10-26 11:00 AM', buyerId: 'u3', buyerName: 'Charlie Chaplin', items: [{ listingId: 'l1', name: 'Vintage iPhone X', qty: 1 }], total: 250 },
  { id: 's2', timestamp: '2023-10-25 03:00 PM', buyerId: 'u1', buyerName: 'Alice Wonderland', items: [{ listingId: 'l2', name: 'Refurbished Galaxy S10', qty: 1 }], total: 180 },
];

const AdminMain = () => {
  const [activeTab, setActiveTab] = useState('users');
  
  // Data states
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [reviews, setReviews] = useState(mockReviewsData);
  const [sales, setSales] = useState(mockSalesData);

  // Search and filter states
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [listingSearchTerm, setListingSearchTerm] = useState('');
  const [reviewSearchTerm, setReviewSearchTerm] = useState('');

  const [editingUser, setEditingUser] = useState(null);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editID, setEditID] = useState('');

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
    review.userName.toLowerCase().includes(reviewSearchTerm.toLowerCase()) ||
    review.content.toLowerCase().includes(reviewSearchTerm.toLowerCase()) ||
    review.listingTitle.toLowerCase().includes(reviewSearchTerm.toLowerCase())
  );


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
        })
        .catch(err => console.error(err));
    }, []);

  // Placeholder for success/error messages
  const [message, setMessage] = useState({ text: '', type: '' }); // type: 'success' or 'error'

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  // Action Handlers (placeholders - implement API calls and state updates)
  const handleEditUser = (e) => {
    e.preventDefault();



    axios.post("/admin/adminUpdateUser", { userID: editID, userFirst: editFirstName, userLast: editLastName, userEmail: editEmail })
            .then(response => {
                if (response.status === 200) {
                    alert("Profile updated successfully.");
                    setEditingUser(null);
                    setUsers(prevUsers =>
                      prevUsers.map(u =>
                        u._id === editID
                          ? { ...u, firstname: editFirstName, lastname: editLastName, email: editEmail }
                          : u
                      )
                    );
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

  const handleDeleteUser = (userID) => {
    //find userId name
    const user = users.find(u => u._id === userID);
    const userName = user.firstname + " " + user.lastname;
    if (window.confirm('Are you sure you want to delete user ' + userName + '? This action cannot be undone.')) {
      axios.post('/admin/adminDeleteUser', { userID })
        .then(response => {
          if (response.status === 200) {
            alert("User deleted successfully.");
            setUsers(users.filter(u => u._id !== userID));
            showMessage(`User ${userName} deleted.`, 'success');
          } else {
            alert(response.data.message || "Failed to delete user.");
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

  const handleEditListing = (listingId) => {
    const newTitle = prompt("Enter new title for listing " + listingId + ":");
    if (newTitle) {
        setListings(listings.map(l => l.id === listingId ? {...l, title: newTitle} : l));
        showMessage(`Listing ${listingId} updated.`, 'success');
    }
  };

  const handleToggleListingStatus = (listingId) => {
    if (window.confirm(`Are you sure you want to toggle status for listing ${listingId}?`)) {
      setListings(listings.map(l => l.id === listingId ? { ...l, disabled: !l.disabled } : l));
      showMessage(`Listing ${listingId} status toggled.`, 'success');
    }
  };

  const handleDeleteListing = (listingId) => {
    if (window.confirm('Are you sure you want to delete listing ' + listingId + '?')) {
      setListings(listings.filter(l => l.id !== listingId));
      showMessage(`Listing ${listingId} deleted.`, 'success');
    }
  };
  
  const handleToggleReviewVisibility = (reviewId) => {
    setReviews(reviews.map(r => r.id === reviewId ? { ...r, visible: !r.visible } : r));
    showMessage(`Review ${reviewId} visibility toggled.`, 'success');
  };

  const handleExportSales = (format) => {
    // Mock: In a real app, generate and download file
    alert(`Exporting sales data as ${format}... (Not implemented)`);
    showMessage(`Sales data export initiated as ${format}.`, 'success');
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

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="mb-6">
        <h1 className="text-4xl font-bold text-gray-800 text-center">Admin Dashboard</h1>
      </header>

      {message.text && (
        <div className={`p-3 my-4 rounded-md text-white ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
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
                        <button onClick={() => alert(`View listings for ${user.firstname} ${user.lastname}`)} className="text-green-600 hover:text-green-900 mr-3">
                          Listings
                        </button>
                        <button onClick={() => alert(`View reviews by ${user.firstname} ${user.lastname}`)} className="text-purple-600 hover:text-purple-900">
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
                      <tr key={listing.id} className={`hover:bg-gray-50 ${listing.disabled ? 'opacity-60 bg-gray-100' : ''}`}>
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
                          <button onClick={() => handleEditListing(listing.id)} className="text-indigo-600 hover:text-indigo-900 mr-3">
                            Edit
                          </button>
                          <button onClick={() => handleToggleListingStatus(listing.id)} className="text-yellow-600 hover:text-yellow-900 mr-3">
                            {listing.disabled ? 'Enable' : 'Disable'}
                          </button>
                          <button onClick={() => handleDeleteListing(listing.id)} className="text-red-600 hover:text-red-900 mr-3">
                            Delete
                          </button>
                          <button onClick={() => alert(`View reviews for ${listing.title}`)} className="text-green-600 hover:text-green-900">
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
              placeholder="Search reviews by user, content, or listing..."
              className="mb-4 p-2 border border-gray-300 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={reviewSearchTerm}
              onChange={(e) => setReviewSearchTerm(e.target.value)}
            />
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {['User', 'Listing', 'Content', 'Visibility', 'Actions'].map(header => (
                      <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReviews.map(review => (
                    <tr key={review.id} className={`hover:bg-gray-50 ${!review.visible ? 'opacity-60 bg-gray-100' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{review.userName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{review.listingTitle}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{review.content}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            review.visible ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {review.visible ? 'Visible' : 'Hidden'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button onClick={() => handleToggleReviewVisibility(review.id)} className="text-blue-600 hover:text-blue-900">
                          {review.visible ? 'Hide' : 'Show'}
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
                      <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sales.map(sale => (
                    <tr key={sale.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(sale.timestamp)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sale.buyerName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {sale.items.map(item => `${item.name} (Qty: ${item.qty})`).join(', ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${sale.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 p-4 border border-gray-200 rounded bg-gray-50">
              <h3 className="text-lg font-semibold mb-2 text-gray-700">Recent Activity / Notifications</h3>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                <li>
                  Order #S1 placed by {sales[0]?.buyerName} for {sales[0]?.items[0]?.name} on {formatDate(sales[0]?.timestamp)}.
                </li>
                <li>
                  User '{users[2]?.firstname} {users[2]?.lastname}' ({users[2]?.email}) registered on{' '}
                  {formatDate(users[2]?.registrationDate)}.
                </li>
                <li>
                  Listing '{listings[0]?.title}' received a new review on{' '}
                  {formatDate(reviews.find(r => r.listingId === listings[0]?.id)?.timestamp)}.
                </li>
                {/* Add more dynamic notifications here, ensuring to use formatDate for any date values */}
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
    </div>
  );
};

export default AdminMain;