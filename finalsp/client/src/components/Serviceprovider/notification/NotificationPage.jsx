import React from 'react';
import './NotificationPage.css';
import { IoArrowBackCircle } from "react-icons/io5";
import { MdMessage } from "react-icons/md";
import { FaCalendarAlt } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const NotificationPage = () => {
  const navigate = useNavigate();

  return (
    <div className="notification-page">
      <div className="notification-container">
        {/* Header */}
        <div className="notification-header">
          <div className="header-left">
            <button 
              className="back-button"
              onClick={() => navigate('/professionalHomepage')}
            >
              {/* <span className="material-icons">arrow_back_rounded</span> */}
              <IoArrowBackCircle />

            </button>
            <h2>Notifications</h2>
          </div>
          <div className="notification-count">
            <span>5</span>
          </div>
        </div>

        {/* Notification List */}
        <div className="notification-list">
          {/* Message Notification */}
          <div className="notification-item">
            <div className="notification-icon primary">
            <MdMessage />
            </div>
            <div className="notification-content">
              <h3>New Message from Dr. Smith</h3>
              <p>Hello, I received your appointment request...</p>
              <span className="notification-time">2 minutes ago</span>
            </div>
          </div>

          {/* Booking Notification */}
          <div className="notification-item">
            <div className="notification-icon secondary">
            <FaCalendarAlt />
            </div>
            <div className="notification-content">
              <h3>Booking Confirmed</h3>
              <p>Your appointment with Dr. Johnson is confirmed</p>
              <span className="notification-time">1 hour ago</span>
            </div>
          </div>

          {/* Review Notification */}
          <div className="notification-item">
            <div className="notification-icon tertiary">
            <FaStar />
            </div>
            <div className="notification-content">
              <h3>New Review Received</h3>
              <p>Sarah M. left you a 5-star review</p>
              <span className="notification-time">2 hours ago</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="notification-actions">
          <button className="primary-button">
            Mark All as Read
          </button>
          <button className="secondary-button">
            View All Notifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;