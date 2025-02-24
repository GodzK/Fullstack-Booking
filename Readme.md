# Meeting Room Booking System

## Description

This project is a **Meeting Room Booking System** built using **React, Axios, and React Big Calendar**. It allows users to:

- View available meeting rooms and their schedules
- Book a meeting room for a specific time slot
- Cancel or modify bookings
- View their profile and booking history

The system integrates with a backend API to fetch and manage bookings, ensuring smooth and efficient scheduling.

## Features

- **User Authentication**: Users can log in to view their personalized booking details.
- **Real-time Booking Management**: Check availability and reserve meeting rooms.
- **Calendar View**: Display all bookings using `react-big-calendar`.
- **Responsive UI**: Designed for usability across different devices.

## Tech Stack

- **Frontend**: React, React Router, Axios, React Big Calendar
- **Backend**: Node.js, Express (Assumed API connection)
- **Database**: MongoDB / PostgreSQL (Assumed)

## Installation

### Prerequisites

Ensure you have the following installed:

- Node.js & npm

### Steps to Run

1. Clone this repository:
   ```sh
   git clone https://github.com/GodzK/Fullstack-Booking.git
   ```
2. Navigate to the Backend folder:
   ```sh
   cd Backend 
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the development server:
   ```sh
   npm run dev

5. Navigate to the Frontend folder:
   ```sh
   cd Frontend
   ```
6. Install dependencies:
   ```sh
   npm install
   ```
7. Start the development server:
   ```sh
   npm run dev
   ```

## API Endpoints (Assumed)

| Method | Endpoint           | Description                |
| ------ | ------------------ | -------------------------- |
| GET    | /api/profile       | Fetch user profile         |
| GET    | /api/bookings      | Fetch all room bookings    |
| POST   | /api/bookings      | Create a new booking       |
| PUT    | /api/bookings/\:id | Update an existing booking |
| DELETE | /api/bookings/\:id | Cancel a booking           |

## How to Use

1. **Login** to access the system.
2. **View the calendar** to check room availability.
3. **Click on a time slot** to book a room.
4. **Manage bookings** by editing or canceling as needed.
5. **Logout** when done.

## Contributing

Only ME GodzK!



