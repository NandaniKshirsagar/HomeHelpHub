import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FirstPage from "./components/landing page/firstpage";
import Login from "./components/auth/login";
import Homepage from "./components/clienthomepage/homepage";
import LocationConfirm from "./location/LocationConfirm";
import ServiceProvider from "./components/electriciansearch/serviceProvider";
import TermsAndConditions from "./components/auth/terms&conditions";

import ProfileSetup from "./components/profilesetup/providerprofile";
import Providerprofile from './components/providerDetails/providerprofile';
import ServiceDetailPage from "./components/booking/ServiceDetailPage";
import DeviceRestriction from "./DevicRestriction";
import Dashboard from "./components/homeSlidebar/dashboard";

import { GoogleOAuthProvider } from '@react-oauth/google';

const CLIENT_ID = "440102358018-20mnt6ivht26orgahn9hcs6aeqj6r3um.apps.googleusercontent.com";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FirstPage />} /> {/* Landing Page */}
        <Route path="/login" element={<Login />} /> {/* Client Login */}
        <Route path="/terms" element={<TermsAndConditions/>} /> {/*Terms and Conditions*/}
        <Route path="/location" element={<LocationConfirm />} /> {/* Location Confirmation */}
        <Route path="/clienthomepage" element={<Homepage />} /> {/* Client Homepage */}
         {/* list of sp */}
        <Route path="/serviceprovider" element={<ServiceProvider/>}/>
       
        <Route path="/profile" element={<ProfileSetup/>} />
        <Route path="/providerinfo" element={<Providerprofile/>}/>
        <Route path="/serviceDetail" element={<ServiceDetailPage/>} />
        <Route path="/dash" element={<Dashboard/>} />
  
        {/* <Route path="/sp/hhh" element={<h1/>} /> 
        <Route path="/sp/request" element={<RequestDetails/>} /> 
        <Route path="/sp/userinfo" element={<UserDetailsPage/>} /> 
        <Route path="/sp/notification" element={<NotificationPage/>} /> 
        <Route path="/sp/profile" element={<ProfileSetup/>} />
        <Route path="/sp/SPprofile" element={<Spprofilepage/>} /> */}


      </Routes> 
    </Router>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="440102358018-20mnt6ivht26orgahn9hcs6aeqj6r3um.apps.googleusercontent.com">
    <DeviceRestriction>
      <App />
    </DeviceRestriction>
     </GoogleOAuthProvider>
  </React.StrictMode>
);