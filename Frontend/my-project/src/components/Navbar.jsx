import React from 'react'
import fullsit from "./fullsit.png"
import { Link } from 'react-router-dom'
import profile from "../pages/images/profile.png"
import axios from "axios";
import Swal from "sweetalert2";
const API_URL = "http://localhost:3000/api";
const logout = async () => {
  try {
    await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
    Swal.fire({
      title: "Logged out!",
      text: "You have been logged out successfully.",
      icon: "success",
      confirmButtonText: "OK"
    }).then(() => {
      window.location.href = "/login";
    });
  } catch (error) {
    Swal.fire("Error", "Logout failed!", "error");
  }
};
function Navbar() {
  return (
<div className="navbar bg-base-100">
  <div className="navbar-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h8m-8 6h16" />
        </svg>
      </div>
    </div>
<div className='nav-logo'>
    <a href="/"><img src={fullsit} alt="" /></a>
</div>
  </div>
  <div className="navbar-center hidden lg:flex">
    <ul className="menu menu-horizontal px-1">
    <li><a href='/'>Home</a></li>
        <li><a href='/booking'>Booking</a></li>
        <li><a href='profile'>Profile</a></li>
    </ul>
  </div>
  <div className="navbar-end">
  <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS Navbar component"
            src={profile} />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
        <li>
          <a className="justify-between" href='profile'>
            Profile
            <span className="badge">data</span>
          </a>
        </li>
        <li><Link to="/login">Login/Sigin</Link></li>
        <li><a onClick={logout}>Logout</a></li>
      </ul>
    </div>
  </div>
</div>
  )
}

export default Navbar