import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
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

  // Fetch User Profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/users/Profile`, {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (error) {
        Swal.fire("Error", "You haven't logged in yet", "error");
        window.location.href = "/login";
      }
    };
    fetchProfile();
  }, []);

  // Fetch all buildings
  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        const response = await axios.get(`${API_URL}/rooms/buildings`, {
          withCredentials: true,
        });
        setBuildings(response.data.buildings);
      } catch (err) {
        console.error("Error fetching buildings:", err);
      }
    };
    fetchBuildings();
  }, []);

  // Fetch areas when building is selected
  useEffect(() => {
    if (!selectedBuilding) return;
    const fetchAreas = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/rooms/areas/${selectedBuilding}`,
          { withCredentials: true }
        );
        setAreas(response.data.areas);
        setSelectedArea("");
        setSelectedRoom("");
      } catch (err) {
        console.error("Error fetching areas:", err);
      }
    };
    fetchAreas();
  }, [selectedBuilding]);

  // Fetch rooms when area is selected
  useEffect(() => {
    if (!selectedArea) return;
    const fetchRooms = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/rooms/rooms/${selectedArea}`,
          { withCredentials: true }
        );
        setRooms(response.data.rooms);
        setSelectedRoom("");
      } catch (err) {
        console.error("Error fetching rooms:", err);
      }
    };
    fetchRooms();
  }, [selectedArea]);

  useEffect(() => {
    fetchAllBookings(selectedBuilding, selectedArea, selectedRoom);
  }, [selectedBuilding, selectedArea, selectedRoom]);

  const fetchAllBookings = async (building = "", area = "", room = "") => {
    try {
      const res = await axios.get(`${API_URL}/bookings`, {
        params: { building, area, room },
        withCredentials: true,
      });
  
      const formattedBookings = res.data.bookings.map((booking) => ({
        id: booking.booking_id,
        title: `Booked by ${booking.email}`,
        description: booking.description,
        start: new Date(booking.start_time),
        end: new Date(booking.end_time),
        room_name: booking.room_name,
        area: booking.area,
        building: booking.building,
        status: booking.status,
      }));
  
      console.log(formattedBookings);  
      setBookings(formattedBookings);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  const handleSelectSlot = ({ start, end }) => {
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
        "You need to log in and select a room first!",
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
        if (!value) return "You need to provide a description!";
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

      fetchAllBookings(selectedBuilding, selectedArea, selectedRoom);
      setSelectedSlot(null);
      Swal.fire("Success", "Booking confirmed", "success");
    } catch (err) {
      console.error("Booking failed:", err);
      Swal.fire("Error", "Booking failed", "error");
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      await axios.delete(`${API_URL}/bookings/${bookingId}`, {
        withCredentials: true,
      });
      fetchAllBookings(selectedBuilding, selectedArea, selectedRoom);
      Swal.fire("Success", "Booking deleted", "success");
    } catch (err) {
      console.error("Deletion failed:", err);
      Swal.fire("Error", "Deletion failed", "error");
    }
  };

  const handleUpdateStatus = async (bookingId, status) => {
    try {
      await axios.put(
        `${API_URL}/bookings/${bookingId}`,
        { status },
        { withCredentials: true }
      );
      fetchAllBookings(selectedBuilding, selectedArea, selectedRoom);
      Swal.fire("Success", `Booking ${status.toLowerCase()}`, "success");
    } catch (err) {
      console.error("Status update failed:", err);
      Swal.fire("Error", "Status update failed", "error");
    }
  };

  const filteredBookings = bookings.filter(
    (booking) =>
      (!selectedBuilding || booking.building === selectedBuilding) &&
      (!selectedArea || booking.area === selectedArea) &&
      (!selectedRoom || booking.room_name === selectedRoom)
  );

  const eventStyleGetter = (event) => {
    let backgroundColor = "#3174ad"; // Default color
    if (event.status === "Pending") {
      backgroundColor = "#ffeb3b"; // Yellow for pending
    } else if (event.status === "Approved") {
      backgroundColor = "#4caf50"; // Green for approved
    } else if (event.status === "Rejected") {
      backgroundColor = "#f44336"; // Red for rejected
    }
    return {
      style: {
        backgroundColor,
        borderRadius: "5px",
        opacity: 0.8,
        color: "black",
        border: "0px",
        display: "block",
      },
    };
  };

  return (
    <div style={{ height: "500px", margin: "20px" }}>
      <h1>Bookings Calendar</h1>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        {buildings.map((building) => (
          <div
            key={building}
            onClick={() => setSelectedBuilding(building)}
            style={{
              cursor: "pointer",
              backgroundColor: selectedBuilding === building ? "#4CAF50" : "#f1f1f1",
              padding: "20px",
              width: "30%",
              textAlign: "center",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              transition: "background-color 0.3s ease",
            }}
          >
            <h3>{building}</h3>
          </div>
        ))}
      </div>

      {selectedBuilding && (
        <div>
          <label>Select Area: </label>
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
          >
            <option value="">-- Select Area --</option>
            {areas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedArea && (
        <div>
          <label>Select Room: </label>
          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
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

      <Calendar
        localizer={localizer}
        events={filteredBookings}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        defaultView="week"
        views={["month", "week", "day"]}
        eventPropGetter={eventStyleGetter}
        components={{
          event: ({ event }) => (
            <div>
              <br />
              <span>{event.title}</span>
              <br />
              <br />
              <small>description : {event.description}</small>
              <br /> <br />
              <small>Building: {event.building}</small><br /><br />
              <small>Floor: {event.area}</small><br /><br />
              <small>Room name: {event.room_name}</small><br /><br />
              {user && ( // แสดงปุ่ม Delete สำหรับทั้งนักเรียนและ Staff
                <>
                  {user.role === "staff" && ( // แสดงปุ่ม Approve และ Reject เฉพาะ Staff
                    <>
                      <button
                        className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded ml-2"
                        onClick={() => handleUpdateStatus(event.id, "Approved")}
                      >
                        Approve
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-red-700 hover:border-red-500 rounded ml-2"
                        onClick={() => handleUpdateStatus(event.id, "Rejected")}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    className="bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 border-b-4 border-orange-700 hover:border-orange-500 rounded"
                    onClick={() => handleDeleteBooking(event.id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          ),
        }}
      />
    </div>
  );
};

export default BookingCalendar;