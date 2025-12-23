import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./login.css"; // Import the CSS file

const Login = () => {
  const [email, setEmail] = useState("");
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [showOtpCard, setShowOtpCard] = useState(false);
  const [otp, setOtp] = useState("");
  const [sentOtp, setSentOtp] = useState("");
  const [showCustomNotification, setShowCustomNotification] = useState(false);
  const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false);
  const navigate = useNavigate();

  // Initialize Google OAuth
  useEffect(() => {
    localStorage.clear();
    loadGoogleScript();
    
    // Check if user is already logged in with Google
    const user = getCurrentUser();
    if (user && user.expires_at > Date.now()) {
      handleExistingGoogleUser(user);
    }
  }, []);

  // Load Google OAuth script
  const loadGoogleScript = () => {
    if (document.querySelector('#google-oauth-script')) return;

    const script = document.createElement('script');
    script.id = 'google-oauth-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setGoogleScriptLoaded(true);
    document.head.appendChild(script);
  };

  // Get current user from localStorage
  const getCurrentUser = () => {
    const user = localStorage.getItem('googleUser');
    return user ? JSON.parse(user) : null;
  };

  // Check if user is logged in with Google
  const isLoggedInWithGoogle = useCallback(() => {
    const user = getCurrentUser();
    return user && user.expires_at > Date.now();
  }, []);

  // Handle existing Google user
  const handleExistingGoogleUser = async (userData) => {
    try {
      // Check if user exists in Firebase
      const response = await axios.post("http://localhost:5001/api/user/get-user", { 
        email: userData.email 
      });

      if (response.data.message === "found") {
        // Email is found in Firebase, redirect to location
        navigate("/location");
      } else {
        // Email is not found in Firebase, redirect to profile setup page
        navigate("/profile");
      }
    } catch (error) {
      console.error("Error checking existing user:", error);
      // If error, remove Google session and let user login again
      handleGoogleLogout();
    }
  };

  // Handle Google Authentication - SIMPLIFIED
  const handleGoogleAuth = () => {
    if (!googleScriptLoaded) {
      alert("Google authentication is loading. Please try again in a moment.");
      return;
    }

    // Use ONLY the token client flow
    triggerGoogleLogin();
  };

  // Trigger Google login - Using Token Client flow
  const triggerGoogleLogin = () => {
    if (window.google && window.google.accounts) {
      window.google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "200772805046-jnufpvo92l15c9oraa372mhdm54bgg5q.apps.googleusercontent.com",
        scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
        callback: async (response) => {
          if (response.access_token) {
            await fetchUserInfo(response.access_token);
          }
          // Google will automatically close the popup after this callback
        },
        error_callback: (error) => {
          console.error('Google OAuth error:', error);
          // Check for specific error types
          if (error.type === 'popup_closed') {
            console.log('User closed the popup');
          } else if (error.type === 'access_denied') {
            alert("You denied the permission request.");
          } else {
            alert("Google authentication failed. Please try again.");
          }
        }
      }).requestAccessToken();
    }
  };

  // Fetch user info using access token - ENHANCED
  const fetchUserInfo = async (accessToken) => {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        
        const userInfo = {
          email: userData.email,
          name: userData.name,
          picture: userData.picture,
          token: accessToken,
          expires_at: Date.now() + (60 * 60 * 1000) // 1 hour
        };
        
        localStorage.setItem('googleUser', JSON.stringify(userInfo));
        localStorage.setItem('email', userData.email);
        console.log('User info saved to localStorage:', userInfo.email);
        
        // Check user in database
        await checkUserInDatabase(userData.email);
      } else {
        throw new Error(`Failed to fetch user info: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      alert("Failed to get user information from Google. Please try again.");
      // Clear any partial data
      localStorage.removeItem('googleUser');
    }
  };

  // Check user in your database
  const checkUserInDatabase = async (userEmail) => {
    try {
      const response = await axios.post("http://localhost:5001/api/user/get-user", { 
        email: userEmail 
      });

      if (response.data.message === "found") {
        // Email is found in Firebase, redirect to location
        navigate("/location");
      } else {
        // Email is not found in Firebase, redirect to profile setup page
        navigate("/profile");
      }
    } catch (error) {
      console.error("Error checking user:", error);
      alert("Error verifying user. Please try again.");
    }
  };

  // Handle Google logout
  const handleGoogleLogout = () => {
    const user = getCurrentUser();
    
    if (user && user.token) {
      // Try to revoke token if it's an access token
      if (!user.token.includes('.')) { // Simple check if it's JWT or access token
        if (window.google && window.google.accounts) {
          window.google.accounts.oauth2.revoke(user.token, () => {
            console.log('Token revoked');
          });
        }
      }
      
      // Disable auto-select for future sessions
      if (window.google && window.google.accounts && window.google.accounts.id) {
        window.google.accounts.id.disableAutoSelect();
      }
    }
    
    localStorage.removeItem('googleUser');
    
    // Clear any Google session cookies
    document.cookie.split(";").forEach(cookie => {
      const [name] = cookie.trim().split("=");
      if (name.includes('google') || name.includes('g_state') || name.includes('GSESSIONID')) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      }
    });
  };

  // Handle email input change
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setIsButtonEnabled(validateEmail(value));
  };

  // Email validation
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  // Handle Continue button click
  const handleContinue = async () => {
    try {
      const response = await axios.post("http://localhost:5001/api/auth/send-otp", { email });
      setSentOtp(response.data.otp);
      console.log("OTP sent:", response.data.otp);
      
      setShowCustomNotification(true);
      setTimeout(() => {
        setShowCustomNotification(false);
        setShowOtpCard(true);
      }, 3000);
    } catch (error) {
      alert("Error sending OTP. Please try again.");
    }

    setIsButtonEnabled(false);
  };

  // Handle OTP input change
  const handleOtpChange = (e) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return;
    if (value.length <= 6) setOtp(value);
  };

  // Handle OTP submission
  const handleOtpSubmit = async () => {
    if (otp.length === 6 && String(otp).trim() === String(sentOtp).trim()) {
      localStorage.setItem("email", email);

      try {
        const response = await axios.post("http://localhost:5001/api/user/get-user", { email });

        if (response.data.message === "found") {
          navigate("/location");
        } else {
          navigate("/profile");
        }
      } catch (error) {
        alert("Error checking email. Please try again.");
      }
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="auth-background">
      <div className="auth-container">
        <h1 className="app-title">HomeHelpHub</h1>

        {/* Custom Notification */}
        {showCustomNotification && (
          <div className="custom-notification">
            <p>OTP sent successfully! Check your email.</p>
          </div>
        )}

        {!showOtpCard ? (
          <div className="input-container">
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              className="email-input"
            />
          </div>
        ) : (
          <div className="otp-card">
            <h2>OTP Authentication</h2>
            <p className="otp-instruction">
              Enter the 6-digit code sent to your email:
            </p>
            <input
              type="text"
              placeholder="Enter OTP"
              maxLength="6"
              value={otp}
              onChange={handleOtpChange}
              className="otp-input"
            />
            <button
              onClick={handleOtpSubmit}
              className="otp-button"
              disabled={otp.length !== 6}
            >
              VERIFY OTP
            </button>
          </div>
        )}

        {!showOtpCard && (
          <button
            className={`continue-button ${isButtonEnabled ? "enabled" : ""}`}
            onClick={handleContinue}
            disabled={!isButtonEnabled}
          >
            CONTINUE
          </button>
        )}

        <div className="divider">Or</div>

        <div className="social-buttons">
          {!googleScriptLoaded ? (
            <button className="login-with-google-btn" disabled>
              Loading Google...
            </button>
          ) : (
            <button
              type="button"
              className="login-with-google-btn"
              onClick={handleGoogleAuth}
            >
              <svg className="google-icon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>
          )}
        </div>

        <p className="terms-text">
          By proceeding, you agree to our{" "}
          <a href="#">Privacy Policy</a> and <a href="#">Terms & Conditions</a>.
        </p>
      </div>
    </div>
  );
};

export default Login;