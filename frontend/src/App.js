import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Main   from "./pages/Main";     
import {AuthPage, ResetPasswordPage}  from "./pages/Auth";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import "./pages/tailwind.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Main />} />          
          <Route path="auth" element={<AuthPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="profile" element={<Profile />} /> 
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
