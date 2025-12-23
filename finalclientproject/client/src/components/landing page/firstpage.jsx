import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./firstpage.css";

const FirstPage = () => {
  const [text1Visible, setText1Visible] = useState(false);
  const [text2Visible, setText2Visible] = useState(false);
  const navigate = useNavigate(); // Initialize navigation

  useEffect(() => {
    // Simulate the animations on page load
    setTimeout(() => {
      setText1Visible(true);
    }, 80);

    setTimeout(() => {
      setText2Visible(true);
    }, 930);

    localStorage.clear();
  }, []);

  return (
    <div className="first-page-container">
      <div className="background-image"></div>
      <div className="content-home">
        <div className="headerfirst">
          <div className={`title ${text1Visible ? "fade-in" : ""}`}>
            <h1>HomeHelpHub</h1>
          </div>
        </div>
        <div className="container">
          <h1 className="center-text">Your One-Stop Solution for Home Services</h1>
        </div>
        <div className="description">
          <p>Professional, Reliable, and Trusted Service Providers at Your Fingertips</p>
        </div>
        <button className="get-started-button" onClick={() => navigate("/login")}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default FirstPage;
