import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import HomePage from "./pages/HomePage.jsx";
import Navbar from "./components/Navbar.jsx";
import Login from "./pages/Login.jsx";
import BookingsCalendar from "./pages/BookingCalendar.jsx";
import Register from "./pages/Register.jsx";
import UserProfile from "./pages/Profile.jsx";
function App() {
  return (
    <Router>
      <Navbar/>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register/>} />
          <Route path="/profile" element={<UserProfile/>} />
          <Route path="/booking" element={<BookingsCalendar/>} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;
