import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "./homepage.css";

const Dash = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [bookings, setBookings] = useState([null]);
  const [activeTab, setActiveTab] = useState("services"); // 'services' or 'bookings'
  const [activeStatus, setActiveStatus] = useState('pending');
  const [providerData, setProviderData] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("email");
  
    if (!email) {
      alert("Please log in to view your bookings.");
      navigate("/login");
      return;
    }
  
    const fetchBookings = async () => {
      try {
        const response = await axios.post("http://localhost:5001/api/request/get-req", {
          email,
        });
  
        if (response.status === 200) {
          const bookings = response.data.allBookings;
          setBookings(bookings);
          console.log(bookings);

          const providers = bookings.map(booking => ({
            spId: booking.spId,
            spCategory: booking.spCategory
          }));
  
          setProviderData(providers);
        } else {
          console.error("Error fetching bookings:", response.data.message);
          alert("Failed to fetch bookings. Please try again later.");
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
  
    fetchBookings();
  }, []);
  
  useEffect(() => {
    console.log(providerData);

    if (providerData.length > 0) {
      providerData.forEach(async (provider) => {
        try {
          const lowercaseSpCategory = provider.spCategory.toLowerCase();

          const response = await axios.post("http://localhost:5001/api/request/get-sp-data", {
            SpId: provider.spId,
            Spcategory: lowercaseSpCategory
          });

          if (response.status === 200) {
            console.log('Provider Data:', response.data);

            setBookings((prevBookings) =>
              prevBookings.map((booking) =>
                booking.spId === provider.spId && booking.spCategory === provider.spCategory
                  ? { ...booking, spEmail: response.data.email, spName: response.data.name }
                  : booking
              )
            );
            
          } else {
            console.error("Error fetching provider data:", response.data.message);
          }
        } catch (error) {
          console.error("Error fetching provider data:", error);
        }
      });
    }
  }, [providerData]);

  const handleRequestAction = (bookingId, action) => {
    const confirmAction = window.confirm(
      `Are you sure you want to ${action} this booking?`
    );

    if (confirmAction) {
      console.log(`Booking ID: ${bookingId} has been ${action}`);

      axios
        .post("http://localhost:5001/api/request/update-req", {
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
    } else {
      console.log("Action was canceled");
    }
  };

  const handleServiceClick = (service) => {
    alert(`You selected the service: ${service.name}`);
    const serviceName = service.name.endsWith('s') ? service.name.slice(0, -1) : service.name;
    localStorage.setItem("selectedService", serviceName);
    setSelectedService(serviceName);
    navigate('/serviceprovider');
  };

  const filterBookingsByStatus = (status) => {
    console.log("Filtering by status:", status);
    return bookings.filter(booking => booking.status.toLowerCase() === status.toLowerCase());
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarItemClick = (item) => {
    switch(item) {
      case 'services':
        setActiveTab('services');
        break;
      case 'bookings':
        setActiveTab('bookings');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'privacy':
        navigate('/privacy');
        break;
      case 'terms':
        navigate('/terms');
        break;
      case 'logout':
        localStorage.removeItem('email');
        localStorage.removeItem('token');
        navigate('/login');
        break;
      default:
        setActiveTab('services');
    }
    setSidebarOpen(false);
  };

  return (
    <div className="dash-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h3>Menu</h3>
          <button className="close-sidebar" onClick={toggleSidebar}>
            &times;
          </button>
        </div>
        <ul className="sidebar-menu">
          <li 
            className={`sidebar-item ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => handleSidebarItemClick('services')}
          >
            Services
          </li>
          <li 
            className={`sidebar-item ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => handleSidebarItemClick('bookings')}
          >
            My Bookings
          </li>
          <li 
            className="sidebar-item"
            onClick={() => handleSidebarItemClick('profile')}
          >
            My Profile
          </li>
          <li 
            className="sidebar-item"
            onClick={() => handleSidebarItemClick('privacy')}
          >
            Privacy Policy
          </li>
          <li 
            className="sidebar-item"
            onClick={() => handleSidebarItemClick('terms')}
          >
            Terms & Conditions
          </li>
          <li 
            className="sidebar-item logout"
            onClick={() => handleSidebarItemClick('logout')}
          >
            Logout
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className={`main-content ${sidebarOpen ? 'shifted' : ''}`}>
        {/* Menu Button */}
        <button className="menu-btn" onClick={toggleSidebar}>
          ☰
        </button>

        {/* Hero Section */}
        <div className="hero-section">
          <h2 className="hero-text">
            "One Hub for All Your Home Service Needs!"
          </h2>
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search for services..."
            />
            <img
              src="https://cdn-icons-png.flaticon.com/128/17287/17287005.png"
              alt="User Icon"
              className="profile-icon"
              onClick={() => handleSidebarItemClick('profile')}
            />
          </div>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'services' && (
            <div className="services-tab">
              <h3 className="section-title">Popular Services</h3>
              <div className="services-grid">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className="service-card"
                    onClick={() => handleServiceClick(service)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="image-container">
                      <img
                        src={service.image}
                        alt={service.name}
                        className="service-image"
                      />
                    </div>
                    <div className="service-info">
                      <h4 className="service-title">{service.name}</h4>
                      <p className="service-description">{service.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="bookings-tab">
              <h3 className="section-title">My Bookings</h3>
              
              {/* Status Filter Bullets */}
              {/* Status Filter Bullets */}
<div className="status-filter">
  <div
    className={`status-bullet pending ${activeStatus === 'pending' ? 'active' : ''}`}
    onClick={() => setActiveStatus('pending')}
  >
    <span className="bullet pending"></span>
    Pending
  </div>
  <div
    className={`status-bullet accepted ${activeStatus === 'accepted' ? 'active' : ''}`}
    onClick={() => setActiveStatus('accepted')}
  >
    <span className="bullet accepted"></span>
    Accepted
  </div>
  <div
    className={`status-bullet completed ${activeStatus === 'completed' ? 'active' : ''}`}
    onClick={() => setActiveStatus('completed')}
  >
    <span className="bullet completed"></span>
    Completed
  </div>
  <div
    className={`status-bullet rejected ${activeStatus === 'rejected' ? 'active' : ''}`}
    onClick={() => setActiveStatus('rejected')}
  >
    <span className="bullet rejected"></span>
    Rejected
  </div>
</div>

              {/* Bookings List */}
              <div className="bookings-list">
                {filterBookingsByStatus(activeStatus).length > 0 ? (
                  filterBookingsByStatus(activeStatus).map((booking, index) => (
                    <div key={index} className={`booking-item ${booking.status}`}>
                    <div className="booking-header-req">
                      <h4>{booking.category}</h4>
                      <span className={`status-tag ${booking.status}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                    <div className="booking-details">
                      <strong>Booking Information</strong>
                      <p><strong>Booking Id: </strong>{booking.id}</p>
                      <p><strong>Date:</strong> {formatDate(booking.appointmentDate)}</p>
                      <p><strong>Time:</strong> {booking.appointmentTime}</p>
                      <p><strong>Issue:</strong> {booking.problemDescription}</p>
                      
                      <strong>Service Provider Information</strong>

                      {booking.status === 'accepted' && (
                        <div className="provider-info">
                          <p><strong>Name:</strong> {booking.spName}</p>
                          <p><strong> Email:</strong> {booking.spEmail}</p>
                        </div>
                      )}
                    </div>
                    
                    {booking.status === 'pending' && (
                      <button className="cancel-btn"
                      onClick={() =>
                        handleRequestAction(booking.id, "canceled")
                      }
                      >Cancel Request</button>
                    )}
                    {booking.status === 'accepted' && (
                      <button className="contact-btn">Contact Provider</button>
                    )}
                  </div>
                  ))
                ) : (
                  <p className="no-bookings">No {activeStatus} bookings found</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const services = [
  {
    name: "Electricians",
    description: "Professional electrical services",
    image: "https://5.imimg.com/data5/SELLER/Default/2023/8/332297137/MG/MO/VY/41045831/home-electrical-repair-maintenance-1000x1000.webp",
    route: "/electriciansearch",
  },
  {
    name: "Plumbers",
    description: "Expert plumbing solutions",
    image: "https://c7.alamy.com/comp/HPK118/plumber-doing-maintenance-jobs-for-water-and-heating-systems-HPK118.jpg",
    route: "/plumbersearch",
  },
  {
    name: "Maids",
    description: "Professional cleaning services",
    image: "https://nepalcleaningsolution.com/wp-content/uploads/2023/01/about-us-1000x675.jpg",
    route: "/maidsearch",
  },
  {
    name: "Carpenters",
    description: "Expert woodwork & repairs",
    image: "https://images.unsplash.com/photo-1610264146566-c233419fb1c7?w=500&h=500",
    route: "/carpentersearch",
  },
  {
    name: "Painters",
    description: "Quality painting services",
    image: "https://thumbs.dreamstime.com/z/professional-house-painter-work-painting-wall-caucasian-house-painter-worker-white-work-overalls-roller-139299830.jpg",
    route: "/paintersearch",
  },
  {
    name: "Home Tutors",
    description: "Personalized Learning",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5AcAIRCYFLm4SLR-ywgA_wKApuAD-NTI80Q&s",
    route: "/hometutorsearch",
  },
  {
    name: "Home nurses",
    description: "Professional nursing services",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTl_h1jgW-ls1vYDbiIWfgAIkby2fVIiZaOHw&s",
    route: "/homenursessearch",
  },
  {
    name: "Security Guards",
    description: "Professional security services",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQSNVHw3dH098mjXlZvgfKP4l8cAiu6Mj5AA&s",
    route: "/securityguardssearch",
  },
  {
    name: "Vehical Cleaners",
    description: "Professional cleaning services",
    image: "https://gomechprod.blob.core.windows.net/gomech-retail/gomechanic_assets/7%20services%20Images/festive/thumbnail.jpg",
    route: "/cleanervsearch",
  },
];

export default Dash;