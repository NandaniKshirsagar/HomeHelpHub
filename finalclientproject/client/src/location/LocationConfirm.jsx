import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LocationConfirm.css";

const LocationConfirm = () => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasLocation, setHasLocation] = useState(false);
  const navigate = useNavigate();

  // Check if location is already stored on component mount
  useEffect(() => {
    const storedCoords = localStorage.getItem("userCoordinates");
    if (storedCoords) {
      setHasLocation(true);
      try {
        const coords = JSON.parse(storedCoords);
        setMessage(`📍 Location already enabled (${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)})`);
      } catch (error) {
        console.error("Error parsing stored coordinates:", error);
      }
    }
  }, []);

  const handleDenyClick = () => {
    setMessage("Location access is needed for nearby services");
  };

  const handleAllowClick = () => {
    // Check browser support
    if (!("geolocation" in navigator)) {
      setMessage("❌ Browser doesn't support location");
      return;
    }

    setIsLoading(true);
    setMessage("Getting your location...");

    navigator.geolocation.getCurrentPosition(
      // Success callback
      (position) => {
        const { latitude, longitude } = position.coords;
        const coordinates = { 
          latitude, 
          longitude,
          timestamp: new Date().toISOString()
        };

        console.log("📍 Location:", coordinates);
        
        // Store in localStorage
        localStorage.setItem("userCoordinates", JSON.stringify(coordinates));
        setHasLocation(true);
        setIsLoading(false);
        
        setMessage("✅ Location saved! Redirecting...");
        
        // Redirect after short delay
        setTimeout(() => {
          navigate("/clienthomepage");
        }, 1000);
      },
      // Error callback
      (error) => {
        setIsLoading(false);
        
        // User-friendly error messages
        let errorMessage = "⚠️ ";
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "You denied location access";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Location unavailable";
            break;
          case error.TIMEOUT:
            errorMessage += "Location request timed out";
            break;
          default:
            errorMessage += "Failed to get location";
        }
        
        setMessage(errorMessage);
        
        // Option: Still redirect even without location
        setTimeout(() => {
          navigate("/clienthomepage");
        }, 3000);
      },
      // Options
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 0
      }
    );
  };

  // Use default location as fallback
  const useDefaultLocation = () => {
    const defaultCoords = {
      latitude: 21.1458, // Nagpur coordinates
      longitude: 79.0882,
      source: "default",
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem("userCoordinates", JSON.stringify(defaultCoords));
    setHasLocation(true);
    setMessage("📍 Using Nagpur location. Redirecting...");
    
    setTimeout(() => {
      navigate("/clienthomepage");
    }, 1000);
  };

  // Continue without location
  const continueWithoutLocation = () => {
    setMessage("Continuing without location...");
    setTimeout(() => {
      navigate("/clienthomepage");
    }, 500);
  };

  return (
    <div className="location-container">
      <div className="location-box">
        <div className="location-header">
          <h2>Location Access</h2>
          <p>Allow access to your location?</p>
        </div>
        
        <p className="location-description">
          This helps find nearby services and provide accurate information.
        </p>

        {/* Show current location if available */}
        {hasLocation && (
          <div style={{ 
            margin: "10px 0", 
            padding: "8px", 
            background: "#f0f8ff", 
            borderRadius: "6px",
            fontSize: "0.85rem"
          }}>
            <span style={{ color: "#1976d2" }}>📍 Location is enabled</span>
          </div>
        )}

        <div className="location-buttons">
          <button 
            className="deny-button" 
            onClick={handleDenyClick}
            disabled={isLoading}
          >
            Deny
          </button>
          
          <button 
            className="allow-button" 
            onClick={handleAllowClick}
            disabled={isLoading}
          >
            {isLoading ? (
              "Loading..."
            ) : (
              <>
                <i className="fas fa-map-marker-alt"></i> Allow
              </>
            )}
          </button>
        </div>

        {/* Alternative options */}
        <div style={{ 
          marginTop: "15px", 
          fontSize: "0.85rem",
          textAlign: "center"
        }}>
          <p style={{ color: "#666", marginBottom: "8px" }}>Other options:</p>
          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
            <button 
              onClick={useDefaultLocation}
              style={{
                background: "#ff9800",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "15px",
                fontSize: "0.8rem",
                cursor: "pointer"
              }}
            >
              Use Nagpur
            </button>
            <button 
              onClick={continueWithoutLocation}
              style={{
                background: "transparent",
                color: "#666",
                border: "1px solid #ddd",
                padding: "6px 12px",
                borderRadius: "15px",
                fontSize: "0.8rem",
                cursor: "pointer"
              }}
            >
              Continue Anyway
            </button>
          </div>
        </div>

        {message && (
          <p className="location-message" style={{
            color: message.includes("✅") ? "#2e7d32" : 
                   message.includes("❌") || message.includes("⚠️") ? "#d32f2f" : "#666",
            fontWeight: "normal",
            fontSize: "0.9rem",
            marginTop: "12px"
          }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default LocationConfirm;