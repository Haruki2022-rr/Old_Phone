import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Main   from "./pages/Main";     
import Auth  from "./pages/Auth";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import PhoneDetail from "./pages/phoneDetail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Main />} />          
          <Route path="auth" element={<Auth />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="profile" element={<Profile />} />
          <Route path="phones/:id" element={<PhoneDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
