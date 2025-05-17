//reference: chatGPT -> told how I implemented banckend and gave detailed requirement to generate this code

import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


// AUTH PAGE for Login, Sign‑Up, Forgot password
export function AuthPage() {
  const navigate = useNavigate(); // navicate to another page 
  const location = useLocation();
  // where to go back to
  const from = location.state?.from?.pathname || "/";
  const [mode, setMode] = useState("login"); // which mode we are on among login(default). signuo. reset 
  const [input, setInput] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  // 8+ chars, at least 1 upper, 1 lower, 1 digit, 1 symbol
  const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

  // when input changes, state changes
  const handleChange = (e) =>
    setInput((p) => ({ ...p, [e.target.name]: e.target.value }));

  // run when a submit button clicked 
  async function handleSubmit(e) {
    e.preventDefault(); // stop browser's default full page refresh
    try {
      if (mode === "login") {
        await axios.post("/auth/login", {
          email: input.email,
          password: input.password,
        });
        toast.success("Logged in");
        navigate(from, { replace: true });
      } else if (mode === "signup") {
        if (!strongPassword.test(input.password)) {
          toast.error("Password must have at least 8 charcters including upper, lower, number and symbol.");
          return;
        }
        try {
          const res = await axios.post("/auth/signup", { ...input, from });
            if (res.data?.success) {
              toast.success(res.data.message);
                 setMode("login");
               } else {
                 toast.error(res.data?.message || "Failed to send verification email");
               }
             } catch (err) {
               toast.error(err.response?.data?.message || "Error sending verification email");
             }
        // navigate("/", { replace: true }); // or previous page logic
      } else if (mode === "forgot") {
        await axios.post("/auth/forgetPassword", { email: input.email });
        toast.success("Reset link sent");
        setMode("login");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      {/* placeholder for toast notify */}
      <ToastContainer />
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mb-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 text-gray-700"
        >
          &larr; Back to Home
        </button>
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {mode === "login" && "Sign In"}
          {mode === "signup" && "Create Account"}
          {mode === "forgot" && "Reset Password"}
        </h1>
      <div className="flex justify-center mb-4 space-x-4">
        <button
          onClick={() => setMode("login")} // rerender AuthPage()
          className={`px-3 py-1 rounded-lg text-sm font-medium ${
            mode === "login" ? "bg-cyan-500 text-white" : "bg-gray-100" // ternary ope
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
          Reset Password
        </button>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* only render input field for firstname and lastname when mode is signup */}
        {mode === "signup" && (
          <>
            <input
              type="text"
              name="firstname"
              placeholder="First Name"
              value={input.firstname}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
              required
            />
            <input
              type="text"
              name="lastname"
              placeholder="Last Name"
              value={input.lastname}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
              required
            />
          </>
        )}
        {/* email is always required regardless of mode */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={input.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500"
          required
        />
        {mode !== "forgot" && (
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={input.password}
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


//RESET PASSWORD PAGE – accessed via /reset-password/:token
export function ResetPasswordPage() {
  const navigate = useNavigate();
  const { token } = useParams(); // get :token part from URL
  const [passwords, setPasswords] = useState({ pw1: "", pw2: "" });

  // 8+ chars, at least 1 upper, 1 lower, 1 digit, 1 symbol
  const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

  const handleChange = (e) =>
    setPasswords((p) => ({ ...p, [e.target.name]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (passwords.pw1 !== passwords.pw2) {
      return toast.error("Passwords do not match");
    }

    if (!strongPassword.test(passwords.pw1)) {
      toast.error("Password must have at least 8 charcters including upper, lower, number and symbol.");
      return;
    }
    
    try {
      await axios.post(`/auth/resetPassword/${token}`, {
        password: passwords.pw1,
      });
      toast.success("Password changed");
      navigate("/", { replace: true });
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

// after user clicking the link in a verifycation email -> this page -> direct to previous page(or auth?)
export function VerifyEmailPage() {
    const { token } = useParams();
    const navigate    = useNavigate();
    const location   = useLocation();
    const verified = useRef(false);

    const params = new URLSearchParams(location.search);
    const from  = params.get("from") || "/";

    // run only the first render unless token or navigate change
    useEffect(() => {
      if (verified.current) return;
      verified.current = true;   // to avoid to run twice
      (async () => {
        try {
          // callA API veryfyemail
          const { data } = await axios.get(`/auth/verifyemail/${token}`,{	
            withCredentials: true 
            });
          if (data.success) {
            toast.success("Email verified!");
            // JSON response should include your redirect target
            navigate(from, { replace: true }); 
          } else {
            throw new Error("Verification failed");
          }
        } catch (err) {
          toast.error(err.message);
          // optionally send them back to /auth anyway
          navigate("/auth", { replace: true });
        }
      })();
    }, [token, navigate, from]);
  
    return (
      <div className="max-w-md mx-auto p-6 mt-20 text-center">
        <ToastContainer />
        <p className="text-gray-700">Verifying your email…</p>
      </div>
    );
  }