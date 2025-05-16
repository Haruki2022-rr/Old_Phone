import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import './tailwind.css'

const MainPage = () => {
  const [soldOutSoon, setSoldOutSoon] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [brand, setBrand] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    fetch('http://localhost:5050/api/oldPhoneDeals/phones/soldoutsoon')
      .then(res => res.json())
      .then(setSoldOutSoon);

    fetch('http://localhost:5050/api/oldPhoneDeals/phones/bestsellers')
      .then(res => res.json())
      .then(setBestSellers);
  }, []);

  const handleSearch = () => {
    let url = `http://localhost:5050/api/oldPhoneDeals/phones/search?title=${searchQuery}`;
    if (brand) url += `&brand=${brand}`;
    if (maxPrice) url += `&maxPrice=${maxPrice}`;
    console.log("Fetching:", url);
    fetch(url)
      .then(res => res.json())
      .then(setSearchResults);
  };

  const PhoneCard = ({ phone }) => (
    <div className="border rounded-lg p-4 shadow-md text-center">
      <Link to={`/phones/${phone._id}`}>
      <img
       src={`http://localhost:5050${phone.image}`}
       alt={phone.title}
       className="w-40 h-auto mx-auto mb-2"
       onError={(e) =>{
        e.target.src='/fallback.jpeg'; //optional fallback image
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
        <Link to="/" className="text-lg text-gray-700 hover:text-blue-500">Main</Link>
        <Link to="/auth" className="text-lg text-gray-700 hover:text-blue-500">Auth</Link>
        <Link to="/checkout" className="text-lg text-gray-700 hover:text-blue-500">Checkout</Link>
        <Link to="/profile" className="text-lg text-gray-700 hover:text-blue-500">Profile</Link>
      </nav>
      <div className="bg-white shadow-md rounded-lg p-6">

    <div className="space-y-10">
      {/* Search bar */}
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
            {['Samsung', 'Apple', 'HTC', 'Huawei', 'Nokia', 'LG', 'Motorola', 'Sony', 'BlackBerry'].map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          <div className = "flex flex-col items-center">
            <span className="text-sm mb-1 h-5">${maxPrice || 'Max'}</span>
          <input
            type="range"
            min = "0"
            max = "500"
            step= "1"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-40"
          />
           <div className="flex justify-between w-full text-xs text-gray-400">
          <span>$0</span>
          <span>$500</span>
        </div>
      </div>
      <div className="self-end">
          <button onClick={handleSearch} className="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600">
            Search
          </button>
        </div>
      </div>
    </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Search Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {searchResults.map(phone => (
              <PhoneCard key={phone._id} phone={phone} />
            ))}
          </div>
        </div>
      )}

      {/* Sold Out Soon */}
      <div>
        <h2 className="text-xl font-bold mb-4">Sold Out Soon</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {soldOutSoon.map(phone => (
            <PhoneCard key={phone._id} phone={phone} />
          ))}
        </div>
      </div>

      {/* Best Sellers */}
      <div>
        <h2 className="text-xl font-bold mb-4">Best Sellers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bestSellers.map(phone => (
            <PhoneCard key={phone._id} phone={phone} />
          ))}
        </div>
      </div>
    </div>
    </div>
  </div>
  );
};

export default MainPage;


