import { Link, Outlet } from 'react-router-dom';

function Layout() {
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
        <Outlet />
      </div>
     </div>
   );
  }
  export default Layout;