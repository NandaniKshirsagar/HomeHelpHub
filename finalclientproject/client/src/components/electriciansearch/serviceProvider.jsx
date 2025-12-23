import React, { useState, useEffect } from "react";
import axios from "axios"; // Make sure to install axios if not already done
import "./serviceProvider.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
const ServiceProvider = () => {
  const [providerData, setProviderData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceName, setServiceName] = useState(""); // New state for the selected service name
  const navigate = useNavigate(); // Initialize useNavigate
  // Fetch data from the API when the component mounts
  useEffect(() => {
    let selectedService = localStorage.getItem("selectedService");
    if (selectedService==='Home Tutor')
       {
        selectedService='home_tutor'; // Set the service name dynamically for heading
        console.log(selectedService); // Log the selected service
       }
       if (selectedService==='Home nurse')
        {
         selectedService='home_nurses'; // Set the service name dynamically for heading
         console.log(selectedService); // Log the selected service
        }

        if (selectedService==='Security Guard')
          {
           selectedService='security_guards'; // Set the service name dynamically for heading
           console.log(selectedService); // Log the selected service
          }
          if (selectedService==='Vehical Cleaner')
            {
             selectedService='vehicle_cleaners'; // Set the service name dynamically for heading
             console.log(selectedService); // Log the selected service
            }


    if (selectedService) {
      setServiceName(selectedService); // Set the service name dynamically for heading
      fetchProviderData(selectedService); // Fetch data for the selected service
    }
  }, []);

  // Function to fetch provider data from API based on the selected service
  const fetchProviderData = async (provider) => {
    try {
      const response = await axios.post("http://localhost:5001/api/provider/getProvider", { provider });
      if (response.data && response.data.providerData) {
        setProviderData(response.data.providerData); // Store the data in state
      } else {
        console.log("No provider data found");
      }
    } catch (error) {
      console.error("Error fetching provider data:", error);
    }
  };

  // Filter providers based on search term
  const filteredProviders = providerData.filter((provider) =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle clicking on a provider
  const handleProviderClick = (email) => {
    localStorage.setItem("selectedProviderEmail", email); // Store the selected provider's email
    const SpId = email.replace(/\./g, '_');  
    localStorage.setItem("selectedProviderId", SpId); // Store the selected provider's ID (assuming it's the same as email)
    const clientEmail = localStorage.getItem("email"); // Get the client's email from local storage
    const clientId = clientEmail.replace(/\./g, '_');  // Get the client's ID from local storage
    localStorage.setItem("clientId", clientId); // Store the client's ID
    navigate("/providerinfo"); // Navigate to the provider details page
    console.log("Provider's Email:", email); // Log the email of the clicked provider
  };

  return (
    <div className="electrician-container">
      {/* Header */}
      <header className="header">
        <button className="back-button" onClick={() => window.history.back()}>
          ←
        </button>
        
        {/* Dynamically display the selected service */}
        <h1>{serviceName ? serviceName : "Service Providers"}</h1>
      </header>

      {/* Search Bar */}
      <input
        type="text"
        placeholder={`Search for ${serviceName}...`} 
        className="search-bar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Provider List */}
      <ul className="electrician-list">
        {filteredProviders.map((provider, index) => (
          <li
            key={index}
            className="electrician-card"
            onClick={() => handleProviderClick(provider.email)} // Attach onClick to each provider
          >
            <img
              src={provider.profile_photo}
              alt={provider.name}
              className="profile-pic"
            />
            <div className="info">
              <h2>{provider.name}</h2>
              <p>⭐ {provider.rating} ({provider.reviews} reviews)</p>
              <p>{provider.experience} years experience</p>
            </div>
            <button className="arrow-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="arrow-icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 9l3 3m0 0l-3 3m3-3H8"
                />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServiceProvider;
