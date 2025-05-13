import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


// AUTH PAGE for Login, Sign‑Up, Forgot password
export default function AdminAuthPage() {
  const navigate = useNavigate(); // navigate to another page 
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  // when input changes, state changes
  const handleChange = (e) =>
    setInput((p) => ({ ...p, [e.target.name]: e.target.value }));

  // run when a submit button clicked 
  async function handleSubmit(e) {
    e.preventDefault(); // stop browser's default full page refresh
    try {
        await axios.post("/admin/authentication", 
          {email: input.email,
          password: input.password,},
          { withCredentials: true }
        );
        toast.success("Logged in");
        navigate("/admin/main", { replace: true }); 
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <ToastContainer />  {/* placeholder for toast notify */}
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Admin Authentication
      </h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* only render input field for firstname and lastname when mode is signup */}
        <input
            type="email"
            name="email"
            placeholder="Email"
            value={input.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
            required
        />
        <input
            type="password"
            name="password"
            placeholder="Password"
            value={input.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
            required
        />
        <button
          type="submit"
          className="w-full py-2 font-semibold text-white bg-cyan-500 rounded-lg hover:bg-cyan-600"
        >
          Authenticate
        </button>
      </form>
    </div>
  );
}