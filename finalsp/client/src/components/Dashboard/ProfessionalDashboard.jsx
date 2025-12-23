import React, { useState, useEffect } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { FaCheck, FaTimes } from "react-icons/fa";
import axios from "axios";
import "./ProfessionalDashboard.css";

const ProfessionalDashboard = ({ email, category }) => {
  const [userData, setUserData] = useState(null);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [clientData, setClientData] = useState(null);
  const [acceptedBookings, setAcceptedBookings] = useState([]);
  const [completionModalOpen, setCompletionModalOpen] = useState(false);
const [bookingToComplete, setBookingToComplete] = useState(null);
const [otpSent, setOtpSent] = useState(false);
const [otp, setOtp] = useState("");
const [generatedOtp, setGeneratedOtp] = useState("");
const [otpVerified, setOtpVerified] = useState(false);
const [requestsLoading, setRequestsLoading] = useState(true);

  useEffect(() => {
    const email = localStorage.getItem("email");
    const categoryTrash = localStorage.getItem("category"); 
    const category = categoryTrash.trim();

    const fetchUserData = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3001/api/dash/get-user-data",
          { email, category }
        );

        if (response.status === 200) {
          setUserData(response.data.profileData);
          
        } else {
          setError(response.data.message || "Something went wrong.");
        }
      } catch (err) {
        setError(err.message || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };
    
    const fetchIncomingRequests = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3001/api/dash/get-req",
          { email: localStorage.getItem("email") }
        );
    
        if (response.status === 200) {
          // Handle both cases: response.data.incomingRequests might be undefined or empty
          const requests = response.data.incomingRequests || [];
          const filteredRequests = requests.filter(
            (request) => request.status === "pending"
          );
          setIncomingRequests(filteredRequests);
          setRequestsLoading(false); // after setting the requests

        }
      } catch (err) {
        // Only set error for actual errors, not for empty requests
        if (err.response && err.response.status !== 404) {
          setError(err.message || "Error fetching incoming requests");
        }
        // For 404 or other cases, just set empty array
        setIncomingRequests([]);
      }
    };

    const fetchAcceptedBookings = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3001/api/request/get-accepted-req",
          { spEmail: localStorage.getItem("email") }
        );
  
        if (response.status === 200) {
          setAcceptedBookings(response.data.acceptedBookings || []);
        }
      } catch (err) {
        console.error("Error fetching accepted bookings:", err);
      }
    };
  
    fetchAcceptedBookings();
    fetchUserData();
    fetchIncomingRequests();
  }, [email, category]);

  useEffect(() => {
    if (selectedRequest && selectedRequest.clientEmail) {
      const fetchClientData = async () => {
        try {
          const response = await axios.post(
            "http://localhost:3001/api/dash/get-client-data",
            { email: selectedRequest.clientEmail },
            { headers: { "Content-Type": "application/json" } }
          );

          if (response.status === 200) {
            setClientData(response.data.profileData);
          } else {
            setError(response.data.message || "Error fetching client data");
          }
        } catch (err) {
          console.error("Error fetching client data:", err.message);
          setError(err.message || "Error fetching client data");
        }
      };

      fetchClientData();
    }
  }, [selectedRequest]);

  const handleRequestAction = (bookingId, action) => {
    const confirmAction = window.confirm(
      `Are you sure you want to ${action} this booking?`
    );

    if (confirmAction) {
      axios
        .post("http://localhost:3001/api/request/update-req", {
          bookingId,
          status: action,
        })
        .then((response) => {
          console.log("Booking status updated:", response.data);
          alert(`Booking has been ${action} successfully!`);
          setSelectedRequest(null);
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error updating booking status:", error);
          alert("There was an error updating the booking status.");
        });
    }
  };

  const handleCompleteBooking = (booking) => {
    setBookingToComplete(booking);
    setCompletionModalOpen(true);
    setOtpSent(false);
  };

  const sendOTP = async () => {
    if (!bookingToComplete) return;
    const email = bookingToComplete.clientEmail;
    
    try {
      const response = await axios.post("http://localhost:3001/api/auth/send-otp", { email });
      // Ensure OTP is stored as string and trimmed
      setGeneratedOtp(response.data.otp.toString().trim());
      console.log(response.data.otp);
      setOtpSent(true);
      setOtpVerified(false); // Reset verification status
      setOtp(""); // Clear previous OTP input
      alert("OTP has been sent to the client!");
    } catch (error) {
      alert("Error sending OTP. Please try again.");
    }
  };
  const verifyOTP = () => {
    if (!otp || !generatedOtp) {
      alert("Please enter OTP first");
      return;
    }

    // Normalize both OTPs for comparison
    const enteredOtp = otp.toString().trim();
    const serverOtp = generatedOtp.toString().trim();
    
    console.log("Comparing:", enteredOtp, "vs", serverOtp);

    if (enteredOtp === serverOtp) {
      setOtpVerified(true);
      alert("OTP verified successfully!");
    } else {
      setOtpVerified(false);
      alert("Invalid OTP. Please try again.");
    }
  };
  const verifyAndComplete = () => {
    if (!otpVerified) {
      alert("Please verify OTP first");
      return;
    }
  
    const confirmComplete = window.confirm("Are you sure you want to mark this booking as completed?");
    
    if (confirmComplete) {
      axios
        .post("http://localhost:3001/api/request/update-req", {
          bookingId: bookingToComplete.id,
          status: "completed",
        })
        .then((response) => {
          console.log("Booking marked as completed:", response.data);
          alert("Booking has been completed successfully!");
          setCompletionModalOpen(false);
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error completing booking:", error);
          alert("There was an error completing the booking.");
        });
    }
  };

  const closeModal = () => {
    setSelectedRequest(null);
    setClientData(null);
  };

  const closeCompletionModal = () => {
    setCompletionModalOpen(false);
    setBookingToComplete(null);
    setOtpSent(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error && error !== "Error: Request failed with status code 404") {
    return <div>Error: {error}</div>;
  }
  if (!userData) return <div>No user data found</div>;
  return (
    <div className="prof-dashboard-container">
      <header className="prof-app-header">
        <h1 className="prof-app-title">Professional Dashboard</h1>
        <div className="prof-notification-wrapper">
          <IoMdNotificationsOutline className="prof-notification-icon" />
          <span className="prof-notification-badge"></span>
        </div>
      </header>

      <div className="prof-background-layer"></div>

      <main className="prof-content-area">
        <section className="prof-welcome-section">
          <div className="prof-welcome-header">
            <div>
              <p className="prof-welcome-text">Welcome back,</p>
              <h2 className="prof-user-name">{userData.name || "User"}</h2>
            </div>
            <div className="prof-avatar-frame">
            <img
  src={userData.profile_photo || "https://default-avatar-url.com"}
  alt="User avatar"
  className="prof-user-avatar"
  onError={(e) => {
    e.target.src = "https://via.placeholder.com/60";
  }}
/>
            </div>
          </div>

          <div className="prof-stats-row">
            <div className="prof-stat-box">
              <p className="prof-stat-label">Rating</p>
              <div className="prof-stat-value">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFD700">
                  <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                </svg>
                <span>{userData.rating || "N/A"}</span>
              </div>
            </div>

            <div className="prof-stat-box">
              <p className="prof-stat-label">Jobs Completed</p>
              <p className="prof-stat-value">{userData.total_jobs || 0}</p>
            </div>
          </div>
        </section>

        <section className="prof-card-section">
          <h3 className="prof-section-heading">Incoming Requests</h3>
          {incomingRequests.length === 0 ? (
    <p className="no-requests-message">No incoming requests found</p>
  ) : (
            incomingRequests.map((request) => (
              <div key={request.id} className="prof-request-tile">
                <div className="prof-request-content">
                <div className="prof-service-icon">
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2V4M12 20V22M4 12H2M6.31412 6.31412L4.8999 4.8999M17.6859 6.31412L19.1001 4.8999M6.31412 17.69L4.8999 19.1042M17.6859 17.69L19.1001 19.1042M22 12H20M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12Z"
      stroke="#4B39EF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
</div>
                  <div>
                    <p className="prof-request-title">
                      {request.problemDescription}
                    </p>
                    <p className="prof-request-meta">
                      {new Date(request.createdAt).toLocaleString()} •{" "}
                      <span className="urgent">{request.status}</span>
                    </p>
                  </div>
                </div>
                <button
                  className="prof-action-btn"
                  onClick={() => setSelectedRequest(request)}
                >
                  Details
                </button>
              </div>
            ))
          )}
        </section>

        <section className="prof-card-section">
          <h3 className="prof-section-heading">Upcoming Bookings</h3>
          {acceptedBookings.length === 0 ? (
            <p>No Upcoming bookings</p>
          ) : (
            <div className="schedule-group">
              {acceptedBookings.map((booking) => (
                <div key={booking.id} className="prof-schedule-item">
                  <div className="prof-schedule-header">
                    <p className="prof-schedule-time">{booking.appointmentTime}</p>
                    <span className="prof-status-tag accepted">Accepted</span>
                  </div>
                  <p className="prof-schedule-date">{booking.appointmentDate}</p>
                  <p className="prof-schedule-task">{booking.problemDescription}</p>
                  <p className="prof-schedule-client">Client: {booking.clientEmail}</p>
                  <button 
                    className="prof-complete-btn"
                    onClick={() => handleCompleteBooking(booking)}
                  >
                    Complete
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Request Details Modal */}
        {selectedRequest && (
          <div className="prof-modal-overlay">
            <div className="prof-modal-content">
              <button className="prof-modal-close" onClick={closeModal}>
                <IoClose />
              </button>
              <h2 className="prof-modal-title">Request Details</h2>

              <div className="prof-modal-info-card">
                <div className="prof-modal-info-card-header">
                  Booking Information
                </div>
                <div className="prof-modal-info-card-content">
                  <div className="prof-modal-detail-row">
                    <span className="prof-modal-detail-label">Booking ID:</span>
                    <span className="prof-modal-detail-value">
                      {selectedRequest.id}
                    </span>
                  </div>
                  <div className="prof-modal-detail-row">
                    <span className="prof-modal-detail-label">Problem:</span>
                    <span className="prof-modal-detail-value">
                      {selectedRequest.problemDescription}
                    </span>
                  </div>
                  <div className="prof-modal-detail-row">
                    <span className="prof-modal-detail-label">
                      Appointment Date:
                    </span>
                    <span className="prof-modal-detail-value">
                      {selectedRequest.appointmentDate}
                    </span>
                  </div>
                  <div className="prof-modal-detail-row">
                    <span className="prof-modal-detail-label">
                      Appointment Time:
                    </span>
                    <span className="prof-modal-detail-value">
                      {selectedRequest.appointmentTime}
                    </span>
                  </div>
                </div>
              </div>

              {clientData && (
                <div className="prof-modal-info-card">
                  <div className="prof-modal-info-card-header">
                    Client Information
                  </div>
                  <div className="prof-modal-info-card-content">
                    <div className="prof-modal-detail-row">
                      <span className="prof-modal-detail-label">
                        Client Name:
                      </span>
                      <span className="prof-modal-detail-value">
                        {clientData.name}
                      </span>
                    </div>
                    <div className="prof-modal-detail-row">
                      <span className="prof-modal-detail-label">
                        Client Address:
                      </span>
                      <span className="prof-modal-detail-value">
                        {clientData.address}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="prof-modal-info-card">
                <div className="prof-modal-info-card-header">
                  Request Status
                </div>
                <div className="prof-modal-info-card-content">
                  <div className="prof-modal-detail-row">
                    <span className="prof-modal-detail-label">Category:</span>
                    <span className="prof-modal-detail-value">
                      {selectedRequest.category}
                    </span>
                  </div>
                  <div className="prof-modal-detail-row">
                    <span className="prof-modal-detail-label">
                      Client Email:
                    </span>
                    <span className="prof-modal-detail-value">
                      {selectedRequest.clientEmail}
                    </span>
                  </div>
                  <div className="prof-modal-detail-row">
                    <span className="prof-modal-detail-label">Status:</span>
                    <span className="prof-modal-detail-value">
                      {selectedRequest.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="prof-modal-buttons">
                <button
                  className="prof-action-btn"
                  onClick={() =>
                    handleRequestAction(selectedRequest.id, "accepted")
                  }
                >
                  <FaCheck /> Accept
                </button>
                <button
                  className="prof-action-btn"
                  onClick={() =>
                    handleRequestAction(selectedRequest.id, "rejected")
                  }
                >
                  <FaTimes /> Reject
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Completion Modal */}
        {completionModalOpen && (
  <div className="prof-modal-overlay">
    <div className="prof-modal-content">
      <button className="prof-modal-close" onClick={closeCompletionModal}>
        <IoClose />
      </button>
      <h2 className="prof-modal-title">Complete Booking</h2>

      <div className="prof-modal-info-card">
        <div className="prof-modal-info-card-header">
          Booking Information
        </div>
        <div className="prof-modal-info-card-content">
          <div className="prof-modal-detail-row">
            <span className="prof-modal-detail-label">Booking ID:</span>
            <span className="prof-modal-detail-value">
              {bookingToComplete.id}
            </span>
          </div>
          <div className="prof-modal-detail-row">
            <span className="prof-modal-detail-label">Problem:</span>
            <span className="prof-modal-detail-value">
              {bookingToComplete.problemDescription}
            </span>
          </div>
          <div className="prof-modal-detail-row">
            <span className="prof-modal-detail-label">Client Email:</span>
            <span className="prof-modal-detail-value">
              {bookingToComplete.clientEmail}
            </span>
          </div>
        </div>
      </div>

      {!otpSent ? (
        <div className="prof-modal-buttons">
          <button
            className="prof-action-btn"
            onClick={sendOTP}
          >
            Send OTP to Client
          </button>
        </div>
      ) : (
        <>
          <div className="prof-otp-section">
            <p className="prof-otp-message">
              OTP has been sent to the client. Please ask the client for the OTP.
            </p>
            <input
  type="text"
  placeholder="Enter OTP"
  maxLength="6"
  value={otp}
  onChange={(e) => {
    // Remove all non-digit characters and limit to 6 digits
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
  }}
  className="prof-otp-input"
/>
            <div className="prof-modal-buttons">
              <button
                className="prof-action-btn verify"
                onClick={verifyOTP}
                disabled={otp.length !== 6}
              >
                Verify OTP
              </button>
              {otpVerified && (
                <button
                  className="prof-action-btn complete"
                  onClick={verifyAndComplete}
                >
                  Complete Booking
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  </div>
)}
      </main>
    </div>
  );
};

export default ProfessionalDashboard;