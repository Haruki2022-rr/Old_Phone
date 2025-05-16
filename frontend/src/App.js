import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main   from "./pages/Main";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import AdminAuthPage from "./pages/AdminAuth"
import AdminMain from "./pages/AdminMain"
import {AuthPage, ResetPasswordPage, VerifyEmailPage}  from "./pages/Auth";
import "./pages/tailwind.css";
import { CartProvider } from './context/CartContext';
import RequireAdminAuth from "./components/RequireAdminAuth";
import PhoneDetail from "./pages/phoneDetail";


export default function App() {
  return (
      <CartProvider>
        <BrowserRouter>
          <Routes>

            <Route path="/" element={<Main />} />
            <Route path="auth" element={<AuthPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="verifyemail/:token" element={<VerifyEmailPage />} />
            <Route path="checkout" element={<Checkout />} />
                <Route path="profile" element={<Profile />} />
                <Route path="phones/:id" element={<PhoneDetail />} />
      
            <Route path="adminAuth" element={<AdminAuthPage />} />
            <Route path="admin" element={<RequireAdminAuth />}>   {/* /admin/* will require automatically authentication */}
              <Route path="main" element={<AdminMain />} /> {/* /admin/main *}
              {/* route for admin here */}
            </Route>
        </Routes>
        </BrowserRouter>
      </CartProvider>
  );
}
