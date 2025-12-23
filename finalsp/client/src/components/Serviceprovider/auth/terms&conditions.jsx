import React from "react";
import { useNavigate } from "react-router-dom";
import "./terms&conditions.css"; // Import the CSS file

const TermsAndConditions = () => {
  const navigate = useNavigate();

  const handleAccept = () => {
    navigate("/location"); // Redirect to location page
  };

  return (
    <div className="terms-and-conditions">
      {/* App Bar */}
      <div className="app-bar">
        <h1 className="app-title">Terms & Conditions</h1>
      </div>

      {/* Main Content */}
      <div className="content">
        <p className="last-updated">Last Updated: March 2025</p>

        <p className="intro-text">
          Welcome to HomeHelpHub! Please read these Terms and Conditions carefully before using our platform. By accessing or using HomeHelpHub, you agree to be bound by these terms.
        </p>

        {/* Section 1: Acceptance of Terms */}
        <h2 className="section-title">1. Acceptance of Terms</h2>
        <p className="section-text">
          By using HomeHelpHub, you agree to comply with and be legally bound by these Terms and Conditions. If you do not accept any part of these terms, please discontinue use of our platform.
        </p>

        {/* Section 2: Platform Role */}
        <h2 className="section-title">2. Platform Role</h2>
        <p className="section-text">
          HomeHelpHub is a directory platform that connects users with local service providers. We do not employ or directly endorse any listed professionals.
        </p>

        {/* Section 3: User Accounts */}
        <h2 className="section-title">3. User Accounts</h2>
        <p className="section-text">
          To access certain features, you must create an account with accurate information. You are responsible for maintaining the security of your account credentials.
        </p>

        {/* Section 4: Service Provider Verification */}
        <h2 className="section-title">4. Service Provider Verification</h2>
        <p className="section-text">
          Service providers must submit identity verification documents for approval before being listed on HomeHelpHub. However, we do not guarantee the accuracy or legitimacy of submitted documents.
        </p>

        {/* Section 5: Privacy Policy */}
        <h2 className="section-title">5. Privacy Policy</h2>
        <p className="section-text">
          Your use of HomeHelpHub is also governed by our Privacy Policy, which outlines how we collect, use, and protect your data.
        </p>

        {/* Section 6: Prohibited Activities */}
        <h2 className="section-title">6. Prohibited Activities</h2>
        <p className="section-text">
          Users and service providers may not engage in fraudulent, illegal, or misleading activities while using the platform. We reserve the right to suspend accounts that violate these terms.
        </p>

        {/* Section 7: Payment & Transactions */}
        <h2 className="section-title">7. Payment & Transactions</h2>
        <p className="section-text">
          All payments between users and service providers must be processed through HomeHelpHub’s secure payment system. 
          HomeHelpHub acts as a mediator to track transaction details for transparency and verification. Direct off-platform 
          transactions are not allowed. Failure to comply may result in account suspension or removal.
        </p>

        {/* Section 8: Limitation of Liability */}
        <h2 className="section-title">8. Limitation of Liability</h2>
        <p className="section-text">
          We are not liable for any disputes, damages, or losses arising from interactions between users and service providers.
        </p>

        {/* Section 9: Changes to Terms */}
        <h2 className="section-title">9. Changes to Terms</h2>
        <p className="section-text">
          HomeHelpHub reserves the right to modify these terms at any time. Continued use of the platform after updates implies acceptance of the revised terms.
        </p>

        {/* Section 10: Contact Us */}
        <h2 className="section-title">10. Contact Us</h2>
        <p className="section-text">
          If you have any questions regarding these Terms and Conditions, please contact us at support@homehelphub.com.
        </p>

        {/* Info Box */}
        <div className="info-box">
          <span className="info-icon">ℹ️</span>
          <p className="info-text">
            By continuing to use HomeHelpHub, you acknowledge and agree to these Terms and Conditions.
          </p>
        </div>

        {/* Accept Button */}
        <button className="accept-button" onClick={handleAccept}>I Accept</button>
      </div>
    </div>
  );
};

export default TermsAndConditions;
