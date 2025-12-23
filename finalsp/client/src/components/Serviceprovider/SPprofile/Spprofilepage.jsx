import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../SPprofile/Spprofilepage.css'; // Import your CSS file here
import { useNavigate } from 'react-router-dom';
import { Bounce } from 'react-toastify'; 
import nagpurLocations from '../SPprofile/nagpurLoc.json'; // Import the locations JSON

const ServiceProviderForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        phone: '',
        category: '',
        experience: '',
        available_hours: '',
        locations: [],
        id_proof: '',
        profile_photo: null,
        bio: '',
        languages: {
            english: false,
            marathi: false,
            hindi: false
        },
        aadhar_photo: null
    });
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
  
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredLocations, setFilteredLocations] = useState([]);
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);

    // Get email from googleUser object in localStorage
    const getUserEmailFromLocalStorage = () => {
        try {
            const googleUser = localStorage.getItem('googleUser');
            if (googleUser) {
                const parsedUser = JSON.parse(googleUser);
                return parsedUser.email;
            }
            
            // Fallback to direct email if googleUser doesn't exist
            return localStorage.getItem('email');
        } catch (error) {
            console.error('Error parsing googleUser:', error);
            return localStorage.getItem('email');
        }
    };

    // Set email from localStorage on component mount
    useEffect(() => {
        const userEmail = getUserEmailFromLocalStorage();
        
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
          console.log('User email found:', userEmail);
          setFormData((prevData) => ({
            ...prevData,
            email: userEmail
          }));
        }
      }, []);

      useEffect(() => {
        const handleBeforeUnload = (event) => {
          localStorage.clear();
          console.log('LocalStorage cleared on page unload');
          event.returnValue = 'Are you sure you want to leave?';
        };
      
        window.addEventListener('beforeunload', handleBeforeUnload);
      
        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
        };
      }, []);

    // Filter locations based on search term
    useEffect(() => {
        if (searchTerm.length > 0) {
            const filtered = nagpurLocations.filter(location =>
                location.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredLocations(filtered);
            setShowLocationDropdown(true);
        } else {
            setFilteredLocations([]);
            setShowLocationDropdown(false);
        }
    }, [searchTerm]);

    // Load saved images from localStorage on component mount
    useEffect(() => {
        const savedProfilePhoto = localStorage.getItem('profileImgUrl');
        const savedAadharPhoto = localStorage.getItem('aadharImgUrl');
        const userEmail = getUserEmailFromLocalStorage(); // Use our helper function
        
        if (savedProfilePhoto) {
            setFormData(prev => ({
                ...prev,
                profile_photo: savedProfilePhoto
            }));
        }

        if (savedAadharPhoto) {
            setFormData(prev => ({
                ...prev,
                aadhar_photo: savedAadharPhoto
            }));
        }

        if (userEmail) {
            setFormData(prev => ({
                ...prev,
                email: userEmail
            }));
        }
    }, []);

    const handleLocationSelect = (location) => {
        if (!formData.locations.includes(location)) {
            setFormData(prev => ({
                ...prev,
                locations: [...prev.locations, location]
            }));
        }
        setSearchTerm('');
        setShowLocationDropdown(false);
    };

    // Remove a selected location
    const removeLocation = (locationToRemove) => {
        setFormData(prev => ({
            ...prev,
            locations: prev.locations.filter(location => location !== locationToRemove)
        }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        // Always get fresh email from localStorage when handling changes
        const savedEmail = getUserEmailFromLocalStorage();
        
        setFormData(prev => ({
            ...prev,
            email: savedEmail || prev.email // Use saved email or keep existing
        }));

        if (name === 'languages') {
            setFormData(prev => ({
                ...prev,
                languages: {
                    ...prev.languages,
                    [value]: checked
                }
            }));
        }
        else if (type === 'file') {
            // File handling will be done in specific handlers
            return;
        }
        else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Helper function to get user email for API calls
    const getCurrentUserEmail = () => {
        const email = getUserEmailFromLocalStorage();
        if (!email) {
            throw new Error('No user email found in localStorage');
        }
        return email;
    };

    const handleProfileFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const MAX_SIZE = 1 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            toast.error("File size exceeds 1 MB. Please upload a smaller image.");
            return;
        }

        try {
            const userEmail = getCurrentUserEmail();
            
            // 1. First upload to local storage
            const localUrl = URL.createObjectURL(file);
            localStorage.setItem('profile_photo_local', localUrl);

            // 2. Then upload to API
            await handleProfileImageUploadApi(file, userEmail);
            const imgapiUrl = localStorage.getItem('profileImgUrl');
            
            // 3. Update formData with API URL
            setFormData(prev => ({
                ...prev,
                profile_photo: imgapiUrl,
                email: userEmail // Ensure email is set
            }));

            toast.success("Profile image uploaded successfully!");
        } catch (error) {
            toast.error("Error uploading profile image.");
            console.error("Upload Error:", error);
        }
    };

    const handleAadharFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const MAX_SIZE = 1 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            toast.error("Aadhar image size exceeds 1 MB. Please upload a smaller image.");
            return;
        }

        try {
            const userEmail = getCurrentUserEmail();
            
            // 1. First upload to local storage
            const localUrl = URL.createObjectURL(file);
            localStorage.setItem('aadhar_photo_local', localUrl);

            // 2. Then upload to API
            await handleAadharImageUploadApi(file, userEmail);
            const aadharurl = localStorage.getItem('aadharImgUrl');
            
            // 3. Update formData with API URL
            setFormData(prev => ({
                ...prev,
                aadhar_photo: aadharurl,
                email: userEmail // Ensure email is set
            }));

            toast.success("Aadhar image uploaded successfully!");
        } catch (error) {
            toast.error("Error uploading Aadhar image.");
            console.error("Upload Error:", error);
        }
    };

    const handleProfileImageUploadApi = async (file, userEmail) => {
        const formDataUpload = new FormData();
        formDataUpload.append("image", file);
        formDataUpload.append("email", userEmail);

        try {
            const response = await axios.post(
                "http://localhost:3001/api/user/upload-img",
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

    const handleAadharImageUploadApi = async (file, userEmail) => {
        const formDataUpload = new FormData();
        formDataUpload.append("image", file);
        formDataUpload.append("email", userEmail);

        try {
            const response = await axios.post(
                "http://localhost:3001/api/user/upload-img",
                formDataUpload,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (response.status === 200 && response.data.success) {
                const imageUrl = response.data.imageUrl;
                localStorage.setItem('aadharImgUrl', imageUrl);
                return imageUrl;
            }
            throw new Error("Failed to upload Aadhar image");
        } catch (error) {
            console.error("API Upload Error:", error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const userEmail = getCurrentUserEmail();
            formData.email = userEmail;
            
            // Convert languages object to array of selected languages
            const selectedLanguages = Object.entries(formData.languages)
                .filter(([_, isSelected]) => isSelected)
                .map(([language]) => language);
                
            if (formData.locations.length < 3) {
                toast.error('Please select at least 3 service locations');
                return;
            }
            
            // Prepare the data to send
            const dataToSend = {
                ...formData,
                email: userEmail, // Ensure email is included
                languages: selectedLanguages,
                profile_photo: formData.profile_photo,
                aadhar_photo: formData.aadhar_photo
            };

            console.log("Submitting data:", dataToSend);

            const response = await axios.post(
                'http://localhost:3001/api/user/createServiceProvider',
                dataToSend,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 201) {
                toast.success('Profile created successfully!');
                console.log('Profile created:', response.data);
                localStorage.setItem('category', response.data.category);
                navigate('/terms');
                
                // Reset form
                setFormData({
                    email: userEmail, // Keep the email for reference
                    name: '',
                    phone: '',
                    category: '',
                    experience: '',
                    available_hours: '',
                    locations: [],
                    id_proof: '',
                    profile_photo: null,
                    bio: '',
                    languages: {
                        english: false,
                        marathi: false,
                        hindi: false
                    },
                    aadhar_photo: null
                });
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error(error.response?.data?.message || 'Error creating profile. Please try again.');
        }
    };

    const nextStep = () => {
        // Basic validation before proceeding
        if (currentStep === 1 && (!formData.name || !formData.phone || !formData.bio)) {
            toast.warning('Please fill all required fields');
            return;
        }
        if (currentStep === 2 && (!formData.category || !formData.experience || !formData.available_hours)) {
            toast.warning('Please fill all required fields');
            return;
        }
        setCurrentStep(prev => prev + 1);
    };

    const prevStep = () => setCurrentStep(prev => prev - 1);

    const totalSteps = 3;

    return (
        <div className="form-container">
            <ToastContainer position="bottom-center" autoClose={5000} />

            <div className="form-header">
                <h2>Create Service Provider Profile</h2>
                <p>Complete your profile to start getting service requests</p>
            </div>

            {/* Progress Indicators */}
            <div className="progress-container">
                <div className="progress-bar" style={{ width: `${(currentStep / totalSteps) * 100}%` }}></div>
            </div>

            <div className="step-indicators">
                {[...Array(totalSteps)].map((_, i) => (
                    <div
                        key={i}
                        className={`step-indicator ${currentStep > i ? 'completed' : ''} ${currentStep === i + 1 ? 'active' : ''}`}
                    />
                ))}
            </div>

            <form onSubmit={handleSubmit}>
                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                    <div className="form-section">
                        {/* Display user email (read-only) */}
                        <div className="form-group">
                            <label>Email Address (from Google)</label>
                            <input
                                type="text"
                                value={formData.email || getUserEmailFromLocalStorage() || 'Loading...'}
                                readOnly
                                disabled
                                className="readonly-field"
                            />
                            <p className="helper-text">This email is from your Google account</p>
                        </div>

                        <div className="avatar-container-profile">
                            <label htmlFor="profile-upload" className="avatar">
                                {formData.profile_photo ? (
                                    <img src={formData.profile_photo} alt="Profile" className="profile-image" />
                                ) : (
                                    <i className="user-icon"></i>
                                )}
                            </label>
                            <input
                                id="profile-upload"
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleProfileFileChange}
                            />
                        </div>

                        {/* Name, Phone, Bio and Languages */}
                        <div className="form-group">
                            <label htmlFor="name" className="required-field">Full Name</label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone" className="required-field">Phone Number</label>
                            <input
                                id="phone"
                                type="number"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+91 1234567890"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="bio" className="required-field">Bio</label>
                            <textarea
                                id="bio"
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                placeholder="Tell us about yourself and your services"
                                rows={3}
                                required
                            />
                            <p className="helper-text">Minimum 50 characters</p>
                        </div>

                        <div className="form-group">
                            <label>Languages Spoken</label>
                            <div className="checkbox-group">
                                {Object.entries(formData.languages).map(([language, isChecked]) => (
                                    <label key={language} className="checkbox-item">
                                        <input
                                            type="checkbox"
                                            name="languages"
                                            value={language}
                                            checked={isChecked}
                                            onChange={handleChange}
                                        />
                                        {language.charAt(0).toUpperCase() + language.slice(1)}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Professional Information */}
                {currentStep === 2 && (
                    <div className="form-section">
                        <div className="form-group">
                            <label htmlFor="category" className="required-field">Service Category</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select your service category</option>
                                <option value="electrician">Electrician</option>
                                <option value="plumber">Plumber</option>
                                <option value="carpenter">Carpenter</option>
                                <option value="painter">Painter</option>
                                <option value="maid">Maid</option>
                                <option value="home_tutor">Cleaner</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="experience" className="required-field">Years of Experience</label>
                            <input
                                id="experience"
                                type="number"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                placeholder="0"
                                min="0"
                                max="50"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="available_hours" className="required-field">Available Hours Per Week</label>
                            <input
                                id="available_hours"
                                type="number"
                                name="available_hours"
                                value={formData.available_hours}
                                onChange={handleChange}
                                placeholder="20"
                                min="1"
                                max="80"
                                required
                            />
                            <p className="helper-text">Typical availability for service requests</p>
                        </div>
                    </div>
                )}

                {/* Step 3: Verification */}
                {currentStep === 3 && (
                    <div className="form-section">
                        <div className="form-group">
                            <label htmlFor="location" className="required-field">
                                Service Locations (Select at least 3)
                            </label>
                            <div className="location-search">
                                <input
                                    id="location"
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search for locations in Nagpur"
                                />
                                {showLocationDropdown && filteredLocations.length > 0 && (
                                    <div className="location-dropdown">
                                        {filteredLocations.map((location) => (
                                            <div
                                                key={location}
                                                className="location-item"
                                                onClick={() => handleLocationSelect(location)}
                                            >
                                                {location}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Display selected locations */}
                            <div className="selected-locations">
                                {formData.locations.map(location => (
                                    <div key={location} className="location-tag">
                                        {location}
                                        <button
                                            type="button"
                                            onClick={() => removeLocation(location)}
                                            className="remove-location"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {formData.locations.length < 3 && (
                                <p className="error-text">Please select at least 3 locations</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="id_proof" className="required-field">Government ID Proof</label>
                            <input
                                id="id_proof"
                                type="number"
                                name="id_proof"
                                value={formData.id_proof}
                                onChange={handleChange}
                                placeholder="Aadhar Number, PAN, etc."
                                required
                                minLength="12"
                                maxLength="12"
                                pattern="^\d{12}$"
                            />
                            <p className="helper-text">For verification purposes only</p>
                            {formData.id_proof && formData.id_proof.length !== 12 && (
                                <p className="error-text" style={{ color: 'red' }}>Please enter a valid 12-digit Aadhar number.</p>
                            )}
                            
                            <p className="aadhar-p">Upload aadhar front page
                                <a href="https://strapi-cdn.indmoney.com/cdn-cgi/image/quality=80,format=auto,metadata=copyright,width=700/https://strapi-cdn.indmoney.com/medium_aadhaar_card_0ae45bd73d.webp" target="_blank" rel="noopener noreferrer">
                                    (View Example)
                                </a>
                            </p>
                            <input
                                type="file"
                                name="aadharFile"
                                placeholder="Upload Aadhar Front Page"
                                onChange={handleAadharFileChange}
                            />

                            {formData.aadhar_photo && (
                                <div>
                                    <p>Aadhar Image Uploaded:</p>
                                    <a href={formData.aadhar_photo} target="_blank" rel="noopener noreferrer">
                                        <img
                                            src={formData.aadhar_photo}
                                            alt="Uploaded Aadhar"
                                            style={{ maxWidth: '200px', maxHeight: '150px', cursor: 'pointer' }}
                                        />
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="form-buttons">
                    {currentStep > 1 && (
                        <button
                            type="button"
                            onClick={prevStep}
                            className="btn btn-secondary"
                        >
                            ← Previous
                        </button>
                    )}
                    {currentStep < totalSteps ? (
                        <button
                            type="button"
                            onClick={nextStep}
                            className="btn btn-primary"
                        >
                            Next →
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="btn btn-success"
                        >
                            Submit Profile
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ServiceProviderForm;