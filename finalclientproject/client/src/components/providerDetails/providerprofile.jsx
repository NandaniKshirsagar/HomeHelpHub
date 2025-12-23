import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import { FaLocationDot } from "react-icons/fa6";
import axios from 'axios';
import './providerprofile.css';

const Maidprofile = () => {
  const [providerDetails, setProviderDetails] = useState(null); // State to hold provider details
  const [rating, setRating] = useState(4);
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('selectedProviderEmail');
    const storedCategory = localStorage.getItem('selectedService'); // Assuming service provider category is saved in local storage

    console.log("Stored Email:", storedEmail); // Log the stored email for debugging
    console.log("Stored Category:", storedCategory); // Log the stored category for debugging

    if (!storedEmail || !storedCategory) {
      // If either email or category is not found, show alert and redirect
      alert("No provider email or category found. Please select a provider first.");
      navigate('/serviceprovider'); // Redirect to service provider page
    } else {
      // Fetch provider details using the stored email and category
      fetchProviderDetails(storedEmail, storedCategory);
    }
  }, [navigate]);

  // Function to fetch provider details from API
  const fetchProviderDetails = async (email, category) => {
    try {
      const response = await axios.post('http://localhost:5001/api/provider/getProviderDetails', {
        email: email,
        category: category
      });
      
      if (response.data && response.data.providerData) {
        setProviderDetails(response.data.providerData); // Store the provider details in state
      } else {
        alert("No provider details found.");
      }
    } catch (error) {
      console.error("Error fetching provider details:", error);
      alert("Error fetching provider details. Please try again later.");
    }
  };

  if (!providerDetails) {
    // Show loading or fallback UI while data is being fetched
    return <div>Loading provider details...</div>;
  }

  return (
    <div className="maid-profile-container">
      <div className="app-bar">
        <button className="back-button" onClick={() => navigate('/maid')}>
          <span className="back-icon">←</span>
        </button>
        <h1 className="title">Details</h1>
      </div>

      <div className="profile-content">
        <div className="profile-image-container">
          <img
            src={providerDetails.profile_photo || "https://media.istockphoto.com/id/1205299877/photo/portrait-of-confident-woman-in-sari.jpg?s=612x612&w=0&k=20&c=JkYeRIOYybTIsSw8QLZklJvSKjPFLuhZSgaYSIbAhDI="}
            alt="Profile Image"
            className="profile-image"
          />
        </div>

        <div className="profile-details-card">
          <div className="profile-header">
            <h2 className="maid-name">{providerDetails.name || "Unknown Name"}</h2>
          </div>

          <div className="rating-container">
            <Rating
              name="maid-rating"
              value={rating}
              precision={0.5}
              onChange={(event, newValue) => setRating(newValue)}
              className="rating-stars"
            />
          </div>

          {/* <div className="action-buttons">
            <button className="chat-button" onClick={() => navigate('/chat')}>
              <span className="chat-icon">💬</span>
              <span>Chat</span>
            </button>
            <div className="divider"></div>
            <button className="call-button">
              <span className="call-icon">📞</span>
              <span>Call</span>
            </button>
          </div> */}

          <div className="bio-section">
            <h3 className="section-title">Service Provider Bio</h3>
            <p className="bio-text">
              <h2>{providerDetails.name}</h2>
              ⭐ Rating: {providerDetails.rating || "N/A"}/5<br />
              🛠️ Experience: {providerDetails.experience || "N/A"}+ Years<br />
              🏠 Services: {providerDetails.services || "Services provided based on user requirements."}<br />
              {/* Render locations */}
              
              <FaLocationDot /> Locations:
                      {providerDetails.locations && providerDetails.locations.length > 0 ? (
                       <ul>
                        {providerDetails.locations.map((location, index) => (
                          <li key={index}>{location}</li> // If location is a string
                         ))}
                       </ul>
                        ) : (
                     <p>No locations available</p>
                      )}
              
              ✅ Specialty: {providerDetails.specialty || "Experienced service provider"}<br />
            </p>
          </div>

          <button className="book-now-button" onClick={() => navigate('/serviceDetail')}>
            Book Now
          </button>

          <button className="favorite-button">
            <span className="favorite-icon">♡</span>
            Favorite service provider
          </button>
        </div>
      </div>
    </div>
  );
};

export default Maidprofile;
