import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Main   from "./pages/Main";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import {AuthPage, ResetPasswordPage, VerifyEmailPage}  from "./pages/Auth";
import "./pages/tailwind.css";
import { CartProvider } from './context/CartContext';

export default function App() {
  return (
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
            <Route index element={<Main />} />
            <Route path="auth" element={<AuthPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="verifyemail/:token" element={<VerifyEmailPage />} />
            <Route path="checkout" element={<Checkout />} />
              <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
        </BrowserRouter>
      </CartProvider>
  );
}
