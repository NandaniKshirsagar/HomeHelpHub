// GoogleSignInButton.jsx or your component
import { useEffect } from 'react';

const GoogleSignInButton = () => {
  const handleGoogleSignIn = () => {
    // Initialize Google OAuth client
    const client = google.accounts.oauth2.initTokenClient({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
      callback: async (response) => {
        if (response.access_token) {
          await fetchUserInfo(response.access_token);
        }
      },
      error_callback: (error) => {
        console.error('Google OAuth error:', error);
        localStorage.removeItem('user');
      }
    });
    
    // Request access token
    client.requestAccessToken();
  };

  const fetchUserInfo = async (accessToken) => {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        
        // Store user data in localStorage
        const userInfo = {
          email: userData.email,
          name: userData.name,
          picture: userData.picture,
          token: accessToken,
          expires_at: Date.now() + (60 * 60 * 1000) // 1 hour expiration
        };
        
        localStorage.setItem('user', JSON.stringify(userInfo));
        
        // Dispatch event for other components to react
        window.dispatchEvent(new Event('userAuthChange'));
        
        console.log('User logged in:', userInfo);
        
        // Redirect or update UI
        window.location.href = '/account';
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      localStorage.removeItem('user');
    }
  };

  const handleLogout = () => {
    const token = JSON.parse(localStorage.getItem('user'))?.token;
    
    if (token) {
      // Revoke Google token
      google.accounts.oauth2.revoke(token, () => {
        console.log('Token revoked');
      });
    }
    
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('userAuthChange'));
    window.location.href = '/';
  };

  useEffect(() => {
    // Load Google OAuth script dynamically
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('Google OAuth script loaded');
    };
    document.head.appendChild(script);

    // Check for existing user session
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      // Check if token is expired
      if (userData.expires_at < Date.now()) {
        localStorage.removeItem('user');
      }
    }

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // Check if user is logged in
  const isLoggedIn = () => {
    const user = localStorage.getItem('user');
    if (!user) return false;
    
    const userData = JSON.parse(user);
    return userData.expires_at > Date.now();
  };

  // Get current user
  const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  };

  return (
    <div>
      {isLoggedIn() ? (
        <div>
          <p>Welcome, {getCurrentUser()?.name}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleGoogleSignIn} style={styles.googleButton}>
          <img 
            src="https://developers.google.com/identity/images/g-logo.png" 
            alt="Google logo"
            style={styles.googleLogo}
          />
          Sign in with Google
        </button>
      )}
    </div>
  );
};

const styles = {
  googleButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4285F4',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    gap: '10px'
  },
  googleLogo: {
    width: '20px',
    height: '20px',
    backgroundColor: 'white',
    padding: '4px',
    borderRadius: '2px'
  }
};

export default GoogleSignInButton;
export { getCurrentUser, isLoggedIn, handleLogout };