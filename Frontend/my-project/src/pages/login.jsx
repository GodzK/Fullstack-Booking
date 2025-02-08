import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import Swal from "sweetalert2"; // ✅ Import SweetAlert
import loginpic from "./loginpic.png";

const API_URL = "http://localhost:3000/api"; 

const login = async (credentials) => {
  return await axios.post(`${API_URL}/auth/login`, credentials, { withCredentials: true });
};

function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate(); // ✅ Use navigate for redirection

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(credentials); 
      console.log("Login Successful:", response.data);

      // ✅ SweetAlert Success Message
      Swal.fire({
        title: "Login Successful!",
        text: "Redirecting to Booking Page...",
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      });

      // ✅ Redirect to booking page after delay
      setTimeout(() => {
        navigate("/booking");
      }, 2000);

    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);

      // ✅ SweetAlert Error Message
      Swal.fire({
        title: "Login Failed!",
        text: error.response?.data?.message || "Invalid credentials",
        icon: "error",
      });
    }
  };

  return (
    <div className="bg-sky-100 flex justify-center items-center h-screen">
      <div className="w-1/2 h-screen hidden lg:block">
        <img src={loginpic} alt="Login" className="object-cover w-full h-full" />
      </div>

      <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
        <h1 className="text-2xl font-semibold mb-4">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600">Email Address</label>
            <input 
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              id="email" 
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" 
              autoComplete="off" 
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-800">Password</label>
            <input 
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500" 
              autoComplete="off" 
            />
          </div>

          <button 
            type="submit" 
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
          >
            Login
          </button>
        </form>
        <div className="mt-6 text-green-500 text-center">
    <a href="/register" className="hover:underline">Sign up Here</a>
  </div>
      </div>
    </div>
  );
}

export default Login;
