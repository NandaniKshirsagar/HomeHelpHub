import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../profilesetup/providerprofile.css';
import { useNavigate } from 'react-router-dom';
import { Bounce } from 'react-toastify';

const ClientForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        phone: '',
        address: '',
        age: '',
        locations: '',
        latitude: null,
        longitude: null,
        profile_photo: null,
    });
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [isFetchingLocation, setIsFetchingLocation] = useState(false); // New state to track fetching status

    // Get user email from localStorage on component mount
    useEffect(() => {
        const userEmail = localStorage.getItem('email');
        if (!userEmail) {
            toast.error('Authentication failed! No email found.', {
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
                onClose: () => navigate('/login'),
            });
        } else {
            console.log('User email:', userEmail);
            // Correctly set the email in formData
            setFormData(prevData => ({
                ...prevData,
                email: userEmail
            }));
        }
    }, [navigate]);

    // Load saved profile photo
    useEffect(() => {
        const savedProfilePhoto = localStorage.getItem('profileImgUrl');
        if (savedProfilePhoto) {
            setFormData(prev => ({
                ...prev,
                profile_photo: savedProfilePhoto
            }));
        }
    }, []);

    // Corrected getCoordinates function
    const getCoordinates = () => {
        // First, check if the browser supports geolocation
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by this browser.");
            return;
        }

        setIsFetchingLocation(true); // Disable button and show loading state
        toast.info("Requesting location access... Please allow permission.", { autoClose: 3000 });

        // Define options for better accuracy, as per MDN docs[citation:9]
        const options = {
            enableHighAccuracy: true,  // Request the best possible accuracy (may use GPS)
            timeout: 10000,           // Wait up to 10 seconds for a result
            maximumAge: 0             // Do not use a cached position
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setFormData((prevData) => ({
                    ...prevData,
                    latitude,
                    longitude,
                }));
                setIsFetchingLocation(false);
                toast.success(`Location fetched: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`, { autoClose: 4000 });
            },
            (error) => {
                setIsFetchingLocation(false);
                let errorMessage = "Error fetching coordinates.";
                // Provide user-friendly error messages based on error codes[citation:4][citation:9]
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = "Location access was denied. Please enable permissions in your browser.";
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = "Your location could not be determined (e.g., GPS signal lost).";
                        break;
                    case error.TIMEOUT:
                        errorMessage = "The request to get your location took too long. Please try again.";
                        break;
                    default:
                        errorMessage = `Geolocation error: ${error.message}`;
                }
                toast.error(errorMessage);
                console.error("Geolocation error:", error);
            },
            options // Pass the options object
        );
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        // Do NOT overwrite the email from localStorage here.
        // Only update the field that the user is changing.
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleProfileFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const MAX_SIZE = 1 * 1024 * 1024; // 1 MB
        if (file.size > MAX_SIZE) {
            toast.error("File size exceeds 1 MB. Please upload a smaller image.");
            return;
        }

        // Get email directly from localStorage to avoid stale state
        const userEmail = localStorage.getItem('email') || formData.email;
        if (!userEmail) {
            toast.error("Cannot upload image: User email not found.");
            return;
        }

        try {
            const localUrl = URL.createObjectURL(file);
            localStorage.setItem('profile_photo_local', localUrl);

            await handleProfileImageUploadApi(file, userEmail);
            const imgapiUrl = localStorage.getItem('profileImgUrl');

            setFormData(prev => ({
                ...prev,
                profile_photo: imgapiUrl
            }));

            toast.success("Profile image uploaded successfully!");
        } catch (error) {
            toast.error("Error uploading profile image.");
            console.error("Upload Error:", error);
        }
    };

    // handleProfileImageUploadApi remains the same
    const handleProfileImageUploadApi = async (file, userEmail) => {
        const formDataUpload = new FormData();
        formDataUpload.append("image", file);
        formDataUpload.append("email", userEmail);

        try {
            const response = await axios.post(
                "http://localhost:5001/api/user/upload-client-profile",
                formDataUpload,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (response.status === 200 && response.data.success) {
                const imageUrl = response.data.imageUrl;
                localStorage.setItem('profileImgUrl', imageUrl);
                return imageUrl;
            }
            throw new Error("Failed to upload profile image");
        } catch (error) {
            console.error("API Upload Error:", error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const SavedEmail = localStorage.getItem("email");
        const SavedProfilePhoto = localStorage.getItem("profileImgUrl");
        formData.email = SavedEmail;

        if (!formData.latitude || !formData.longitude) {
            toast.error("Please fetch your location before submitting.");
            return;
        }

        if (!formData.email || !formData.name || !formData.phone || !formData.age || !formData.address || !formData.profile_photo) {
            toast.error("Please fill all required fields before submitting.");
            return;
        }

        const dataToSend = {
            email: SavedEmail,
            name: formData.name,
            phone: formData.phone,
            age: formData.age,
            address: formData.address,
            latitude: parseFloat(formData.latitude),
            longitude: parseFloat(formData.longitude),
            profile_photo: SavedProfilePhoto || '',
        };
        console.log("Submitting data:", dataToSend);

        try {
            const response = await axios.post(
                'http://localhost:5001/api/user/create-user',
                dataToSend,
                { headers: { 'Content-Type': 'application/json' } }
            );
            if (response.status === 201) {
                toast.success('Profile created successfully!');
                console.log('Profile created:', response.data);
                navigate('/terms');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.response?.data?.message || 'Error creating profile. Please try again.');
        }
    };

    const nextStep = () => {
        // Corrected validation logic - separate if statements
        if (currentStep === 1 && (!formData.name || !formData.phone || !formData.age)) {
            toast.warning('Please fill all required fields (Name, Phone, Age).');
            return;
        }
        // This condition is now reachable
        if (currentStep === 2 && !formData.email) {
            toast.warning('Email is required.');
            return;
        }
        setCurrentStep(prev => prev + 1);
    };

    const prevStep = () => setCurrentStep(prev => prev - 1);

    const totalSteps = 2;

    return (
        <div className="form-container">
            <ToastContainer position="bottom-center" autoClose={5000} />
            <div className="form-header">
                <h2>Create Client Profile</h2>
                <p>Complete your profile to start service requests</p>
            </div>

            {/* Progress Indicators */}
            <div className="progress-container">
                <div className="progress-bar" style={{ width: `${(currentStep / totalSteps) * 100}%` }}></div>
            </div>
            <div className="step-indicators">
                {[...Array(totalSteps)].map((_, i) => (
                    <div key={i} className={`step-indicator ${currentStep > i ? 'completed' : ''} ${currentStep === i + 1 ? 'active' : ''}`} />
                ))}
            </div>

            <form onSubmit={handleSubmit}>
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                    <div className="form-section">
                        <div className="avatar-container-profile">
                            <label htmlFor="profile-upload" className="avatar">
                                {formData.profile_photo ? (
                                    <img src={formData.profile_photo} alt="Profile" className="profile-image" />
                                ) : (
                                    <i className="user-icon"></i>
                                )}
                            </label>
                            <input id="profile-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleProfileFileChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="name" className="required-field">Full Name</label>
                            <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone" className="required-field">Phone Number</label>
                            <input id="phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 1234567890" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="age" className="required-field">Age</label>
                            <input id="age" type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Enter your Age" required />
                        </div>
                    </div>
                )}

                {/* Step 2: Address & Location */}
                {currentStep === 2 && (
                    <div className="form-section">
                        {/* Email field - Pre-filled and read-only might be better */}
                        <div className="form-group">
                            <label htmlFor="email" className="required-field">Email</label>
                            <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your Email" required readOnly className="readonly-field" />
                            <p className="helper-text">This is the email from your login.</p>
                        </div>
                        <div className="form-group">
                            <label htmlFor="address" className="required-field">Address</label>
                            <input id="address" type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Enter your Address" required />
                        </div>
                        {/* Geolocation Fetch */}
                        <div className="form-group">
                            <label className="required-field">Current Location</label>
                            <button type="button" onClick={getCoordinates} className="btn btn-secondary" disabled={isFetchingLocation}>
                                {isFetchingLocation ? 'Fetching...' : 'Fetch My Current Coordinates'}
                            </button>
                            <p className="helper-text">Click while at your home or service location.</p>
                            {formData.latitude && formData.longitude && (
                                <div className="coordinates-display">
                                    <p><strong>Coordinates fetched successfully:</strong></p>
                                    <p>Latitude: {formData.latitude.toFixed(6)}</p>
                                    <p>Longitude: {formData.longitude.toFixed(6)}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="form-buttons">
                    {currentStep > 1 && (
                        <button type="button" onClick={prevStep} className="btn btn-secondary">← Previous</button>
                    )}
                    {currentStep < totalSteps ? (
                        <button type="button" onClick={nextStep} className="btn btn-primary">Next →</button>
                    ) : (
                        <button type="submit" className="btn btn-success">Submit Profile</button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ClientForm;