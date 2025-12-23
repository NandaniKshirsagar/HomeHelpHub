import React, { useEffect, useState } from 'react';

const DeviceRestriction = ({ children }) => {
  const [isAllowed, setIsAllowed] = useState(true);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;

      // You can adjust the threshold (e.g., max width for mobile is 768px)
      if (width > 768) {
        setIsAllowed(false);
      } else {
        setIsAllowed(true);
      }
    };

    checkDevice();

    // Optional: listen for resize
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  if (!isAllowed) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>This app is only available on mobile devices.</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default DeviceRestriction;
