import React from 'react';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-container">
      <button className="back-button" onClick={() => window.history.back()}>Back</button>
      <h1>Privacy Policy</h1>
      {/* Add your privacy policy content here */}
      <p>
        This is a sample paragraph for the privacy policy. Replace this text with your actual privacy policy content.
      </p>
      <h2>Test Message</h2> {/* Add a test message */}
    </div>
  );
};

export default PrivacyPolicy;
