function Layout() {
    return (
     <div className="App">
     <h1>Old Phone Deals</h1>
     <nav>
        <Link to="/">Main</Link> |{" "}
        <Link to="/auth">Auth</Link> |{" "}
        <Link to="/checkout">Checkout</Link> |{" "}
        <Link to="/profile">Profile</Link>
      </nav>

      <Outlet />
     </div>
     );
  }
  export default Layout;