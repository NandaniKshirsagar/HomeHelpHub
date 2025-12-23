import React from 'react';
import { RingLoader } from 'react-spinners';
import './Loader.css'; // We'll create this next

const Loader = ({ message = "Finding travel companions..." }) => {
  return (
    <div className="loader-overlay">
      <div className="loader-content">
        <RingLoader 
          size={100} 
          color="#36d7b7" 
          cssOverride={{
            display: 'block',
            margin: '0 auto'
          }}
        />
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Loader;