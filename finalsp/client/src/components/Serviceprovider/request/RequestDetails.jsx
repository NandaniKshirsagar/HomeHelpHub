import React, { useState } from 'react';
import './RequestDetails.css';
import { FaArrowCircleLeft } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";
import { FaClock } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const RequestDetails = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('SumitR1@gmail.com');

  return (
    <div className="request-details">
      {/* App Bar */}
      <header className="app-bar">
        <button 
          className="back-button"
          onClick={() => navigate('/professionalHomepage')}
        >
          <FaArrowCircleLeft />
        </button>
        <h1 className="app-title">Request Details</h1>
      </header>

      {/* Main Content */}
      <main className="content">
        {/* Request Summary Card */}
        <section className="card request-summary">
          <div className="request-header">
            <div className="request-info">
              <h2 className="request-number">Request #2847</h2>
              <p className="request-date">Submitted on June 15, 2023</p>
            </div>
          </div>
          <div className="divider"></div>
          <div className="request-details-grid">
            <div className="detail-row">
              <span className="detail-label">Service Type</span>
              <span className="detail-value">Electricity Service</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Priority Level</span>
              <span className="detail-value priority-high">High</span>
            </div>
          </div>
        </section>

        {/* Problem Description Card */}
        <section className="card problem-description">
          <h2 className="section-title">Problem Description</h2>
          <p className="description-text">
            Frequent power fluctuations in the living room due to a faulty electrical outlet. 
            The issue started three days ago and has become more severe, causing flickering 
            lights and potential appliance damage. Needs urgent inspection and repair to 
            prevent electrical hazards.
          </p>
          <div className="notes-container">
            <p className="notes-title">Additional Notes</p>
            <ul className="notes-list">
              <li>- Electrical outlet is sparking intermittently.</li>
              <li>- Voltage levels appear to be unstable.</li>
              <li>- Previous temporary fix didn't resolve the issue.</li>
            </ul>
          </div>
        </section>

        {/* Request By Card */}
        <section 
          className="card request-by"
          onClick={() => navigate('/userdetailspage')}
        >
          <h2 className="section-title">Request By:</h2>
          <div className="user-info">
            <div className="user-avatar">
              <FaUserCircle />
            </div>
            <div className="user-details">
              <p className="user-name">Sumit Roy</p>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="email-input"
              />
            </div>
          </div>
        </section>

        {/* Schedule Card */}
        <section className="card schedule">
          <h2 className="section-title">Schedule</h2>
          <div className="schedule-item">
          <FaCalendarAlt />
            <span>Thursday, June 17, 2023</span>
          </div>
          <div className="schedule-item">
          <FaClock />
            <span>02:30 PM - 04:30 PM</span>
          </div>
        </section>

        {/* Location Card */}
        <section className="card location">
          <h2 className="section-title">Location</h2>
          <div className="location-item">
          <FaLocationDot />
            <span>123 Park Avenue, Apt 4B<br />New York, NY 10002</span>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="cancel-button">
            Cancel Request
          </button>
          <button className="accept-button">
            Accept Request
          </button>
        </div>
      </main>
    </div>
  );
};

export default RequestDetails;