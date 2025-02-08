import React, { useState } from "react";
import { register } from "../api.js";
import { useNavigate } from "react-router-dom"; 
import Swal from "sweetalert2"; // ✅ Import SweetAlert
import regispic from "./regispic.png"

const Register = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    role: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 
    try {
      const response = await register(formData);
      console.log("Registration successful:", response.data);

      // ✅ SweetAlert Success Message
      Swal.fire({
        title: "Registration Successful!",
        text: "Redirecting to Login Page...",
        icon: "success",
        timer: 2000,
        showConfirmButton: false
      });

      // ✅ Redirect to login page after delay
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {
      console.error("Registration failed:", error);
      setError(error.response?.data?.message || "Registration failed. Please try again.");

      // ✅ SweetAlert Error Message
      Swal.fire({
        title: "Registration Failed!",
        text: error.response?.data?.message || "Something went wrong!",
        icon: "error",
      });
    }
  };

  return (
    <div className="bg-sky-100 flex justify-center items-center h-screen">
      <div className="w-1/2 h-screen hidden lg:block">
        <img src={regispic} alt="Placeholder Image" className="object-cover w-full h-full" />
      </div>

      <div className="lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2">
        <h1 className="text-2xl font-semibold mb-4">Register</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="firstname" className="block text-gray-600">First Name</label>
            <input
              type="text"
              name="firstname"
              placeholder="First Name"
              onChange={handleChange}
              id="firstname"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="lastname" className="block text-gray-600">Last Name</label>
            <input
              type="text"
              name="lastname"
              placeholder="Last Name"
              onChange={handleChange}
              id="lastname"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              id="email"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              id="password"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600">Role</label>
            <div className="flex space-x-4">
              {['Student', 'Lecturer', 'Staff'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleRoleSelect(role)}
                  className={`py-2 px-4 rounded-md ${formData.role === role ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md py-2 px-4 w-full"
          >
            Register
          </button>
        </form>
        <div className="mt-6 text-green-500 text-center">
          <a href="/login" className="hover:underline">Login Here</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
