import axios from "axios";

const API_URL = "http://localhost:3000/api";

export const register = async (userData) => {
  return await axios.post(`${API_URL}/auth/register`, userData);
};

export const login = async (credentials) => {
  return await axios.post(`${API_URL}/auth/login`, credentials);
};

export const logout = async () => {
  return await axios.post(`${API_URL}/auth/logout`);
};

export const getBookings = async () => {
  return await axios.get(`${API_URL}/bookings`);
};

export const createBooking = async (bookingData) => {
  return await axios.post(`${API_URL}/bookings`, bookingData);
};

export const cancelBooking = async (bookingId) => {
  return await axios.delete(`${API_URL}/bookings/${bookingId}`);
};

export const getUserProfile = async () => {
  return await axios.get(`${API_URL}/auth/Profile`);
};
export const getUserId = async () => {
  return await axios.get(`${API_URL}/users/userId`, { withCredentials: true });
};
export const getUserRole= async () => {
  return await axios.get(`${API_URL}/users/role`, { withCredentials: true });
};
