import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import axios from "axios";

export default function RequireAdminAuth() {
  const loc = useLocation(); // store current location to go back after authentication                   
  const [status, setStatus] = useState({
    checked: false,   // we haven’t asked the server yet
    isAdmin: false,   // default until proven otherwise
  });

  // runs only once, dependency is []
  useEffect(() => {
    axios
      .get("admin/me", { withCredentials: true })
      .then(res =>
        setStatus({ checked: true, isAdmin: res.data.isAdmin })
      )
      .catch(() =>
        setStatus({ checked: true, isAdmin: false })
      );
  }, []);

  // while waiting render nothing
  if (!status.checked) return null;

  // if admin is not authenticated, navigate to 
  if (!status.isAdmin) {
    return (
      <Navigate
        to="/adminAuth"
        state={{ from: loc }}   // can send them back current location after authentication
        replace
      />
    );
  }

  return <Outlet />;
}
