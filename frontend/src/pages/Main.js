import React, { useEffect, useState, useContext} from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import './tailwind.css';
import { CartContext } from "../context/CartContext";

const MainPage = () => {
  const [soldOutSoon, setSoldOutSoon] = useState([]);
  const [allBrands, setAllBrands] = useState(new Set());
  const [bestSellers, setBestSellers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [brand, setBrand] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState('titleAsc');
  const [totalPages, setTotalPages] = useState(1);

  const [user, setUser] = useState(null);
  const { clearCart } = useContext(CartContext);

    // Fetch user once on mount
    useEffect(() => {
        axios.get("/auth/currentUser")
            .then(res => {
                const fetched = res.data.user;
                console.log(fetched);
                setUser(fetched);
            })
            .catch(err => {
                console.error(err);
                console.log('clear cart');
                clearCart()});
    }, []);


  useEffect(() => {
    fetch('http://localhost:5050/api/oldPhoneDeals/phones/soldoutsoon')
      .then(res => res.json())
      .then(setSoldOutSoon);

    fetch('http://localhost:5050/api/oldPhoneDeals/phones/bestsellers')
      .then(res => res.json())
      .then(setBestSellers);
  }, []);

  // Fetch all phones for brand purpose
  useEffect(() => {
    axios.get("http://localhost:5050/api/oldPhoneDeals/phones")
      .then(res => {
        const phones = res.data;
        const brandsSet = new Set();
        phones.forEach(phone => {
          if (phone.brand && !brandsSet.has(phone.brand)) {
            brandsSet.add(phone.brand);
          }
        });
        const brandsArray = Array.from(brandsSet);
        setAllBrands(brandsArray);
        console.log(brandsArray);
      })
      .catch(err => console.error(err));
  }, []);

  const handleSearch = () => {

    let url = `http://localhost:5050/api/oldPhoneDeals/phones/search?title=${searchQuery}&page=${page}&sort=${sort}`;
    if (brand) url += `&brand=${brand}`;
    if (maxPrice) url += `&maxPrice=${maxPrice}`;
    console.log('Search URL:', url);
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.phones) {
          setSearchResults(data.phones);
          setTotalPages(data.totalPages);
        } else {
          setSearchResults([]);
          setTotalPages(1);
        }
      })
      .catch(err => {
        console.error('Search error:', err);
        setSearchResults([]);
        setTotalPages(1);
      });
  };

  useEffect(() => {
    if (searchQuery || brand || maxPrice || page ) {
      handleSearch();
    }
    // eslint-disable-next-line
  }, [page]);

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


  const PhoneCard = ({ phone }) => (
    <div className="border rounded-lg p-4 shadow-md text-center">
      <Link to={`/phones/${phone._id}`}>
        <img
          src={`http://localhost:5050${phone.image}`}
          alt={phone.title}
          className="w-40 h-auto mx-auto mb-2"
          onError={(e) => {
            e.target.src = '/fallback.jpeg'; // Optional fallback image
          }}
        />
        <h3 className="font-semibold">{phone.title}</h3>
      </Link>
      <p className="text-gray-600">${phone.price}</p>
    </div>
  );

  return (
    <div className="App  min-h-screen p-4">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">Old Phone Deals</h1>
      <nav className="flex justify-center space-x-4 mb-6">
          {!user ? (<Link to="/auth" className="text-lg text-gray-700 hover:text-blue-500">Sign in</Link>) :
              (<>
                  <Link to="/profile" className="text-lg text-gray-700 hover:text-blue-500">Profile</Link>
              <button
              className="text-lg text-gray-700 hover:text-blue-500"
              onClick={handleSignOut}>
                 Sign Out
             </button>
            </>)}

        <Link to="/checkout" className="text-lg text-gray-700 hover:text-blue-500">Checkout</Link>

      </nav>
      <div className="bg-white shadow-md rounded-lg p-6">

    <div className="space-y-10">
        <div className="flex flex-col items-center space-y-4">
          <input
            type="text"
            placeholder="Search phones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 w-full md:w-1/2 rounded"
          />
          <div className="flex gap-4 items-center">
            <select value={brand} onChange={(e) => setBrand(e.target.value)} className="border p-2 rounded">
          <option value="">All Brands</option>
          {allBrands && Array.isArray(allBrands) && allBrands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
            </select>

            <div className="flex flex-col items-center">
          <span className="text-sm mb-1 h-5">${maxPrice || 'Max'}</span>
          <input
            type="range"
            min="0"
            max="500"
            step="1"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-40"
          />
          <div className="flex justify-between w-full text-xs text-gray-400">
            <span>$0</span>
            <span>$500</span>
          </div>
            </div>
            <div>
          <select
            value={sort}
            onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
                }}
                className="border p-2 rounded"
              >
                <option value="titleAsc">Title A-Z</option>
                <option value="priceDesc">Price High-Low</option>
              </select>
              </div>
              <div>
              <button
                onClick={() => {
                  if (page === 1) {
                    handleSearch();
                  }
                  setPage(1);
                }}
                className="bg-cyan-500 text-white px-6 py-2 rounded hover:bg-cyan-600"
              >
                Search
              </button>
              </div>
            </div>
            </div>

            {/* Search Results */}
        {searchResults.length > 0 && (
          <>
            <h2 className="text-xl font-bold mb-4">Search Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {searchResults.map((phone) => (
            <PhoneCard key={phone._id} phone={phone} />
          ))}
            </div>
            <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => {
              setPage((prev) => Math.max(prev - 1, 1));
            }}
            disabled={page === 1}
            className={`px-3 py-1 rounded ${page === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx + 1}
              onClick={() => {
            setPage(idx + 1);
              }}
              className={`px-3 py-1 rounded ${
            page === idx + 1
              ? 'bg-cyan-500 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {idx + 1}
            </button>
          ))}
          <button
            onClick={() => {
              setPage((prev) => Math.min(prev + 1, totalPages));
            }}
            disabled={page === totalPages}
            className={`px-3 py-1 rounded ${page === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Next
          </button>
            </div>
          </>
        )}
        
        {searchQuery && searchResults.length === 0 && (
          <>
            {/*<p className="text-center text-lg">No results found</p>*/}
          {/* Sold Out Soon */}
          <div>
            <h2 className="text-xl font-bold mb-4">Sold Out Soon</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {soldOutSoon.map((phone) => (
                <PhoneCard key={phone._id} phone={phone} />
              ))}
            </div>
          </div>

          {/* Best Sellers */}
          <div>
            <h2 className="text-xl font-bold mb-4">Best Sellers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {bestSellers.map((phone) => (
                <PhoneCard key={phone._id} phone={phone} />
              ))}
            </div>
          </div>
        </>
      )}

      {!searchQuery && searchResults.length === 0 && (
        <>
          {/* Sold Out Soon */}
          <div>
            <h2 className="text-xl font-bold mb-4">Sold Out Soon</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {soldOutSoon.map((phone) => (
                <PhoneCard key={phone._id} phone={phone} />
              ))}
            </div>
          </div>

          {/* Best Sellers */}
          <div>
            <h2 className="text-xl font-bold mb-4">Best Sellers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {bestSellers.map((phone) => (
                <PhoneCard key={phone._id} phone={phone} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
    </div>
  </div>
  );
};

export default MainPage;


