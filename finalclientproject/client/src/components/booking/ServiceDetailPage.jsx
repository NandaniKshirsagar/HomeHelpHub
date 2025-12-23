import React, { useState, useEffect } from 'react';
import './ServiceDetailPage.css';

const charges = {
  electrician: 100,
  plumber: 110,
  maid: 80,
  painter: 90,
  carpenter: 105,
  default: 95
};

const GST_RATE = 0.18;

const ServiceDetailPage = () => {
  const [problemDescription, setProblemDescription] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedChips, setSelectedChips] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [baseCharge, setBaseCharge] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const serviceOptions = {
    plumber: ["Leaky Faucets", "Running Toilets", "Clogged Drains", "Low Water Pressure", "Dripping Pipes", "Water Heater Problems", "Sewer System Backup", "Burst Pipes"],
    electrician: ["Flickering Lights", "Power Outage", "Circuit Breaker Tripping", "Electrical Shocks", "Outlet Installation", "Switch Problems", "Wiring Issues", "Light Fixture Installation"],
    painter: ["Wall Painting", "Ceiling Painting", "Exterior Painting", "Color Consultation", "Wallpaper Installation", "Texture Painting", "Cabinet Refinishing", "Deck Staining"],
    carpenter: ["Furniture Repair", "Cabinet Installation", "Door Installation", "Window Repair", "Custom Shelving", "Deck Building", "Molding Installation", "Wood Flooring"],
    maid: ["Deep Cleaning", "Regular Housekeeping", "Window Cleaning", "Laundry Service", "Organization Help", "Post-Construction Cleanup", "Move-In/Move-Out Cleaning", "Special Event Cleanup"]
  };

  useEffect(() => {
    const service = localStorage.getItem('selectedService');
    setSelectedService(service);
  }, []);

  const handleChipClick = (chip) => {
    if (selectedChips.includes(chip)) {
      setSelectedChips(selectedChips.filter(item => item !== chip));
    } else {
      setSelectedChips([...selectedChips, chip]);
    }
  };

  useEffect(() => {
    if (selectedChips.length > 0) {
      const chipsText = selectedChips.join(', ');
      setProblemDescription(`I need help with: ${chipsText}. `);
    }
  }, [selectedChips]);

  const handleSubmit = () => {
    if (!problemDescription.trim()) {
      alert('Please describe your problem');
      return;
    }

    if (!appointmentDate || !appointmentTime) {
      alert('Please select date and time');
      return;
    }

    const charge = charges[selectedService] || charges.default;
    const gst = Math.round(charge * GST_RATE);
    const total = charge + gst;

    setBaseCharge(charge);
    setGstAmount(gst);
    setTotalAmount(total);
    setShowPaymentModal(true);
  };

  const handleFinalBooking = async () => {
    setIsSubmitting(true);
    setShowPaymentModal(false);

    const spEmail = localStorage.getItem('selectedProviderEmail');
    const spId = localStorage.getItem('selectedProviderId');
    const category = localStorage.getItem('selectedService');
    const clientEmail = localStorage.getItem('email');
    const clientId = localStorage.getItem('clientId');

    const formData = {
      clientId,
      clientEmail,
      spId,
      spEmail,
      category,
      problemDescription,
      appointmentDate,
      appointmentTime,
      paymentAmount: totalAmount
    };

    try {
      const response = await fetch('http://localhost:5001/api/booking/submit-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const result = await response.json();
        localStorage.setItem('bookingId', result.bookingId);
        setShowSuccess(true);
        setTimeout(() => {
          window.location.href = '/clienthomepage';
        }, 2000);
      } else {
        throw new Error('Booking failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="booking-container">
      <header className="booking-header">
        <h1 className="header-title">Book Your Service</h1>
      </header>

      <main className="booking-content">
        {selectedService && serviceOptions[selectedService] && (
          <section className="service-chips-section">
            <h2 className="section-title">Common {selectedService} issues</h2>
            <div className="chips-container">
              {serviceOptions[selectedService].map((chip, index) => (
                <div 
                  key={index}
                  className={`service-chip ${selectedChips.includes(chip) ? 'selected' : ''}`}
                  onClick={() => handleChipClick(chip)}
                >
                  {chip}
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="query-section">
          <h2 className="section-title">Describe your problem</h2>
          <div className="input-container">
            <textarea
              className="query-input"
              placeholder="Describe your problem in detail..."
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              rows="5"
            />
            <div className="character-count">{problemDescription.length}/500</div>
          </div>
        </section>

        <section className="datetime-section">
          <h2 className="section-title">When do you need service?</h2>
          <div className="datetime-grid">
            <div className="date-picker">
              <label htmlFor="booking-date" className="input-label">Select Date</label>
              <input
                id="booking-date"
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="styled-input"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="time-picker">
              <label htmlFor="booking-time" className="input-label">Select Time</label>
              <input
                id="booking-time"
                type="time"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                className="styled-input"
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="booking-footer">
        <button 
          className={`confirm-button ${isSubmitting ? 'submitting' : ''}`} 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Booking...' : 'Confirm Booking'}
        </button>
      </footer>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Payment Summary</h2>
            <p>Service: {selectedService}</p>
            <p>Visiting Charge: ₹{baseCharge}</p>
            <p>GST (18%): ₹{gstAmount}</p>
            <hr />
            <p><strong>Total: ₹{totalAmount}</strong></p>
            <button onClick={handleFinalBooking} className="confirm-button">Confirm & Pay</button>
          </div>
        </div>
      )}

      {/* Booking Success Message */}
      {showSuccess && (
        <div className="success-overlay">
          <div className="success-message">
            <h2>🎉 Booking Successful!</h2>
            <p>Redirecting to homepage...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetailPage;
