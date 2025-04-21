// TestCors.jsx
import React, { useEffect } from 'react';

const TestCors = () => {
  useEffect(() => {
    fetch('http://localhost:8000/api/test-cors', {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) {
          response.text().then((text) => console.error('Response Text:', text));
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Fetch Error:', error);
      });
  }, []);

  return <div>Testing CORS...</div>;
};

export default TestCors;