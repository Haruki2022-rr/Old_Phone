import React, { useEffect, useState } from 'react';

const Main = () => {
  const [soldOutSoon, setSoldOutSoon] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [brand, setBrand] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    fetch('/api/phones/soldoutsoon')
      .then(res => res.json())
      .then(setSoldOutSoon);

    fetch('/api/phones/bestsellers')
      .then(res => res.json())
      .then(setBestSellers);
  }, []);

  const handleSearch = () => {
    let url = `/api/phones/search?title=${searchQuery}`;
    if (brand) url += `&brand=${brand}`;
    if (maxPrice) url += `&maxPrice=${maxPrice}`;

    fetch(url)
      .then(res => res.json())
      .then(setSearchResults);
  };

  const PhoneCard = ({ phone }) => (
    <div className="border rounded-lg p-4 shadow-md text-center">
      <img src={phone.image} alt={phone.title} className="w-40 h-auto mx-auto mb-2" />
      <h3 className="font-semibold">{phone.title}</h3>
      <p className="text-gray-600">${phone.price}</p>
    </div>
  );

  return (
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
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="border p-2 rounded"
          />
          <button onClick={handleSearch} className="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600">
            Search
          </button>
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
  );
};

export default Main;
