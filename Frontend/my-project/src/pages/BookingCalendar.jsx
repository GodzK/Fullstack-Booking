import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import lxbuilding from "./images/lxbuilding.png"
import cb2building from "./images/cb2building.png"
import sitbuilding from "./images/sitbuilding.png"
import Swal from "sweetalert2";

const API_URL = "http://localhost:3000/api";
const localizer = momentLocalizer(moment);

const BookingCalendar = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [user, setUser] = useState(null);
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState("");
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const buildingImages = {
    LX: lxbuilding,
    CB2: cb2building,
    SIT: sitbuilding
  };
  // Fetch User Profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/users/Profile`, {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          Swal.fire("Error", "You haven't logged in yet", "error");
          window.location.href = "/login";
        }
      }
    };
    fetchProfile();
  }, []);

  // Fetch buildings
  useEffect(() => {
    const fetchBuildings = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/rooms/buildings`, {
          withCredentials: true,
        });
        setBuildings(response.data.buildings || []);
      } catch (err) {
        console.error("Error fetching buildings:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBuildings();
  }, []);

  // Reset and fetch areas when building changes
  useEffect(() => {
    setSelectedArea("");
    setSelectedRoom("");
    setAreas([]);
    setRooms([]);
    
    if (selectedBuilding) {
      fetchAreas();
    }
  }, [selectedBuilding]);

  // fetch room
  useEffect(() => {
    setSelectedRoom("");
    setRooms([]);
    
    if (selectedArea) {
      fetchRooms();
    }
  }, [selectedArea]);

  const fetchAreas = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/rooms/areas/${selectedBuilding}`,
        { withCredentials: true }
      );
      setAreas(response.data.areas || []);
    } catch (err) {
      console.error("Error fetching areas:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/rooms/rooms/${selectedArea}`,
        { withCredentials: true }
      );
      setRooms(response.data.rooms || []);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedBuilding || selectedArea || selectedRoom) {
      fetchAllBookings();
    }
  }, [selectedBuilding, selectedArea, selectedRoom]);

  const fetchAllBookings = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_URL}/bookings`, {
        params: { 
          building: selectedBuilding, 
          area: selectedArea, 
          room: selectedRoom 
        },
        withCredentials: true,
      });
  
      const formattedBookings = (res.data.bookings || []).map((booking) => ({
        id: booking.booking_id,
        title: `Booked by ${booking.email}`,
        description: booking.description,
        start: new Date(booking.start_time),
        end: new Date(booking.end_time),
        room_name: booking.room_name,
        area: booking.area,
        building: booking.building,
        status: booking.status,
        user_id: booking.user_id
      }));
  
      setBookings(formattedBookings);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSlot = ({ start, end }) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (start < yesterday) {
      Swal.fire("Error", "Cannot book time slots more than 1 day in the past", "error");
      return;
    }

    if (!selectedRoom) {
      Swal.fire("Error", "Please select a room first", "error");
      return;
    }

    setSelectedSlot({ start, end });
  };

  useEffect(() => {
    if (selectedSlot) {
      handleConfirmBooking();
    }
  }, [selectedSlot]);

  const handleConfirmBooking = async () => {
    if (!user || !selectedRoom) {
      Swal.fire(
        "Error",
        "Please log in and select a room before booking",
        "error"
      );
      return;
    }

    const { value: description } = await Swal.fire({
      title: "Confirm Booking",
      input: "text",
      inputLabel: "Enter a description for your booking",
      inputPlaceholder: "e.g., Team meeting, study session...",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value) return "Description is required";
      },
    });

    if (!description) return;

    try {
      await axios.post(
        `${API_URL}/bookings`,
        {
          user_id: user.id,
          room_id: selectedRoom,
          start_time: moment(selectedSlot.start).format("YYYY-MM-DD HH:mm:ss"),
          end_time: moment(selectedSlot.end).format("YYYY-MM-DD HH:mm:ss"),
          status: "Pending",
          description,
          created_by: user.id,
        },
        { withCredentials: true }
      );
    
      await fetchAllBookings();
      setSelectedSlot(null);
      Swal.fire("Success", "Booking confirmed", "success");
    } catch (err) {
      console.error("Booking failed:", err);
      Swal.fire("Error", "Booking failed", "error");
    }
  };

  const handleDeleteBooking = async (bookingId, userId) => {
    if (!user) return;
    
    if (user.id !== userId && user.role !== 'staff') {
      Swal.fire("Error", "You can only delete your own bookings", "error");
      return;
    }

    try {
      await axios.delete(`${API_URL}/bookings/${bookingId}`, {
        withCredentials: true,
      });
      await fetchAllBookings();
      Swal.fire("Success", "Booking deleted", "success");
    } catch (err) {
      console.error("Deletion failed:", err);
      Swal.fire("Error", "Failed to delete booking", "error");
    }
  };

  const handleUpdateStatus = async (bookingId, status) => {
    if (!user || user.role !== 'staff') {
      Swal.fire("Error", "Only staff can update booking status", "error");
      return;
    }

    try {
      await axios.put(
        `${API_URL}/bookings/${bookingId}`,
        { status },
        { withCredentials: true }
      );
      await fetchAllBookings();
      Swal.fire("Success", `Booking ${status.toLowerCase()}`, "success");
    } catch (err) {
      console.error("Status update failed:", err);
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  const eventStyleGetter = (event) => {
    const statusColors = {
      Pending: "#ffeb3b",
      Approved: "#4caf50",
      Rejected: "#f44336"
    };

    return {
      style: {
        backgroundColor: statusColors[event.status] || "#3174ad",
        borderRadius: "5px",
        opacity: 0.8,
        color: event.status === "Pending" ? "black" : "white",
        border: "0px",
        display: "block",
      },
    };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Buildings</h1>

     

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
{buildings.map((building) => (
  <div
    key={building}
    onClick={() => setSelectedBuilding(building)}
    className={`relative cursor-pointer rounded-xl shadow-lg transition-all duration-300
      transform hover:scale-105 overflow-hidden
      ${selectedBuilding === building 
        ? 'border-4 border-blue-500' 
        : 'border-2 border-transparent hover:border-gray-300'
      }`}
    style={{
      backgroundImage: `url(${buildingImages[building] || '/default-image.jpg'})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      height: '300px',
    }}
  >
    <div className="absolute inset-0 bg-black bg-opacity-40"></div>
    <div className="absolute bottom-4 left-4 text-white z-10">
      <h3 className="text-2xl font-semibold">{building}</h3>
      <p className="text-sm">{selectedBuilding === building ? 'Selected' : 'Click to select'}</p>
    </div>
  </div>
))}
</div>


      <div className="space-y-6 mb-8">
        {selectedBuilding && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Area</label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- Select Area --</option>
              {areas.map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>
        )}

        {selectedArea && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Room</label>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- Select Room --</option>
              {rooms.map((room) => (
                <option key={room.room_id} value={room.room_id}>
                  {room.room_name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

   
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="h-[600px]">
          <Calendar
            localizer={localizer}
            events={bookings}
            startAccessor="start"
            endAccessor="end"
            selectable
            onSelectSlot={handleSelectSlot}
            defaultView="week"
            views={["month", "week", "day"]}
            eventPropGetter={eventStyleGetter}
            components={{
              event: ({ event }) => (
                <div className="p-2 overflow-auto max-w-full">
                  <div className="font-semibold mb-1">{event.title}</div>
                  <div className="text-sm space-y-1">
                   {event.room_name} {event.description}
                  </div>
            
                  {user && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {user.role === "staff" && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateStatus(event.id, "Approved");
                            }}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-full text-sm transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateStatus(event.id, "Rejected");
                            }}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-sm transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteBooking(event.id, event.user_id);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-sm transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ),
            }}            
          />
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;