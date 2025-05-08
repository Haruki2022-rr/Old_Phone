import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


// AUTH PAGE for Login, Sign‑Up, Forgot password
export function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // login | signup | forgot
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (mode === "login") {
        await axios.post("/auth/login", {
          email: form.email,
          password: form.password,
        });
        toast.success("Logged in!");
        navigate("/cart", { replace: true }); // or previous page logic
      } else if (mode === "signup") {
        await axios.post("/auth/signup", form);
        toast.success("Verification e‑mail sent!");
        setMode("login");
      } else if (mode === "forgot") {
        await axios.post("/auth/forgetPassword", { email: form.email });
        toast.success("Reset link sent!");
        setMode("login");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <ToastContainer />
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        {mode === "login" && "Sign In"}
        {mode === "signup" && "Create Account"}
        {mode === "forgot" && "Reset Password"}
      </h1>

      {/* tabs */}
      <div className="flex justify-center mb-4 space-x-4">
        <button
          onClick={() => setMode("login")}
          className={`px-3 py-1 rounded-lg text-sm font-medium ${
            mode === "login" ? "bg-cyan-500 text-white" : "bg-gray-100"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setMode("signup")}
          className={`px-3 py-1 rounded-lg text-sm font-medium ${
            mode === "signup" ? "bg-cyan-500 text-white" : "bg-gray-100"
          }`}
        >
          Sign‑Up
        </button>
        <button
          onClick={() => setMode("forgot")}
          className={`px-3 py-1 rounded-lg text-sm font-medium ${
            mode === "forgot" ? "bg-cyan-500 text-white" : "bg-gray-100"
          }`}
        >
          Forgot
        </button>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {mode === "signup" && (
          <>
            <input
              type="text"
              name="firstname"
              placeholder="First Name"
              value={form.firstname}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
              required
            />
            <input
              type="text"
              name="lastname"
              placeholder="Last Name"
              value={form.lastname}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
              required
            />
          </>
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
          required
        />
        {mode !== "forgot" && (
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
            required
          />
        )}
        <button
          type="submit"
          className="w-full py-2 font-semibold text-white bg-cyan-500 rounded-lg hover:bg-cyan-600"
        >
          {mode === "login" && "Log In"}
          {mode === "signup" && "Create Account"}
          {mode === "forgot" && "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------
   RESET PASSWORD PAGE – accessed via /reset-password/:token
-------------------------------------------------------------------*/
export function ResetPasswordPage() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [passwords, setPasswords] = useState({ pw1: "", pw2: "" });

  const handleChange = (e) =>
    setPasswords((p) => ({ ...p, [e.target.name]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (passwords.pw1 !== passwords.pw2) {
      return toast.error("Passwords do not match");
    }
    try {
      await axios.post(`/auth/resetPassword/${token}`, {
        password: passwords.pw1,
      });
      toast.success("Password changed – you can now sign in");
      navigate("/login", { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Error resetting password");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <ToastContainer />
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Reset Password
      </h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="password"
          name="pw1"
          placeholder="New Password"
          value={passwords.pw1}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
          required
        />
        <input
          type="password"
          name="pw2"
          placeholder="Confirm Password"
          value={passwords.pw2}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
          required
        />
        <button
          type="submit"
          className="w-full py-2 font-semibold text-white bg-cyan-500 rounded-lg hover:bg-cyan-600"
        >
          Change Password
        </button>
      </form>
    </div>
  );
}
