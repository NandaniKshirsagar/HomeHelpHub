import React, { useState, useEffect } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { SidebarData } from './slidebarData';
import './dashboard.css';
import { IconContext } from 'react-icons';
import { FaHeart, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Dashboard = () => {
  const [sidebar, setSidebar] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [startX, setStartX] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentUserPrefs, setCurrentUserPrefs] = useState(null);
  const [matchScore, setMatchScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // Add this with your other states

  // Fetch profiles from the API on component mount
//   useEffect(() => {
//     const fetchCurrentUserPreferences = async () => {
//       const email = localStorage.getItem('email');
//       if (!email) {
//         console.error('No email found in localStorage.');
//         toast.error('No email found in localStorage');
//         setIsLoading(false); 
//         return;
//       }

//       try {
//         const response = await axios.post(API_URL_CURRENT_USER_PREFS, { email });
//         setCurrentUserPrefs(response.data);
//       } catch (error) {
//         console.error('Error fetching current user preferences:', error);
//         toast.error('Failed to fetch current user preferences');
//         setIsLoading(false); 
//       }
//     };

//     setIsLoading(true); // Set loading to true when starting to fetch
//     axios.get(API_URL_PROFILES)
//       .then((response) => {
//         const fetchedProfiles = response.data.profiles;
//         const profilesArray = Object.keys(fetchedProfiles).map((key) => {
//           const profile = fetchedProfiles[key];
//           return {
//             name: `${profile.firstName} ${profile.lastName}`,
//             age: new Date().getFullYear() - new Date(profile.dob).getFullYear(),
//             bio: profile.bio,
//             photo: profile.profilePicture,
//             email: key
//           };
//         });
//         setProfiles(profilesArray);
//         fetchCurrentUserPreferences();
//       })
//       .catch((error) => {
//         console.error('Error fetching profiles:', error);
//         toast.error('Failed to fetch profiles');
//         setIsLoading(false); 
//       })
//       .finally(() => {
//         setIsLoading(false); // Set loading to false when done
//       });
//   }, []);

  // Match score calculation function
 
  return (
    <IconContext.Provider value={{ color: '#fff' }}>
      <div className='dashboard'>
        {/* Navbar */}
        <div className='navbar'>
          <Link to='#' className='menu-bars'>
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>
        </div>

        {/* Sidebar */}
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className='nav-menu-items' onClick={showSidebar}>
            <li className='navbar-toggle'>
              <Link to='#' className='menu-bars'>
                <AiIcons.AiOutlineClose />
              </Link>
            </li>

            {SidebarData.map((item, index) => (
              <li key={index} className={item.cName}>
                <Link to={item.path}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

      

        {/* Toast Container for showing toast messages */}
        <ToastContainer />

        {/* Loader Component */}
        {/* {isLoading && <Loader message="Fetching profiles and preferences..." />} */}
      </div>
    </IconContext.Provider>
  );
}

export default Dashboard;