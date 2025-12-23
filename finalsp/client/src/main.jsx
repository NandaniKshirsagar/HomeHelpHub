import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Login from "./components/Serviceprovider/auth/login";
import TermsAndConditions from "./components/Serviceprovider/auth/terms&conditions"; // Fixed import
import LocationConform from "./components/location/LocationConfirm";
import NotificationPage from "./components/Serviceprovider/notification/NotificationPage";
import RequestDeatils from "./components/Serviceprovider/request/RequestDetails";
import Spprofilepage from "./components/Serviceprovider/SPprofile/Spprofilepage";
import FirstPage from "./components/landing page/firstpage"; // Fixed import
import ProfessionalDashboard from "./components/Dashboard/ProfessionalDashboard";
import DeviceRestriction from "./components/DeviceRestriction"; // Fixed import

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FirstPage />} />
        <Route path="/Dashboard" element={<ProfessionalDashboard/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/location" element={<LocationConform />} />
        <Route path="/request" element={<RequestDeatils />} />
        <Route path="/SPprofile" element={<Spprofilepage />} />
        <Route path="/notification" element={<NotificationPage />} />
      </Routes>
    </Router>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <DeviceRestriction>
      <App />
    </DeviceRestriction>
  </React.StrictMode>
);