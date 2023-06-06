import React, { useState } from 'react';
import './Settings.css';
import Modal from 'react-modal';

const Settings = () => {
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const togglePrivacyModal = () => {
    setIsPrivacyModalOpen(!isPrivacyModalOpen);
  };

  const toggleSafetyModal = () => {
    setIsSafetyModalOpen(!isSafetyModalOpen);
  };

  const toggleNotificationsModal = () => {
    setIsNotificationsModalOpen(!isNotificationsModalOpen);
  };

  const togglePasswordModal = () => {
    setIsPasswordModalOpen(!isPasswordModalOpen);
  };

  const toggleHelpModal = () => {
    setIsHelpModalOpen(!isHelpModalOpen);
  }

  return (
    <div className="settings-container">
      <button className="home-button" onClick={() => window.location.href = '/'}>home</button>
      <h1>settings</h1>
      <ul className="settings-list">
        {/* Other links and content */}
        <li>
          <div className="settings-list-container">
            <ul>
              <li className="policy-buttons">
                <button onClick={togglePrivacyModal} className="privacy-policy-button">
                  Privacy 
                </button>
                <Modal
                  isOpen={isPrivacyModalOpen}
                  onRequestClose={togglePrivacyModal}
                  contentLabel="Privacy Policy"
                >
                  <h2>l o l privacy policy</h2>
                  {/* Add your Privacy Policy content here */}
                  <button onClick={togglePrivacyModal}>Close</button>
                </Modal>

                <button onClick={toggleHelpModal} className="help-policy-button">
                  Help
                </button>
                <Modal
                  isOpen={isHelpModalOpen}
                  onRequestClose={toggleHelpModal}
                  contentLabel="Help Policy"
                >
                  <h2>help l o l</h2>
                  {/* Add your Safety Policy content here */}
                  <button onClick={toggleHelpModal}>Close</button>
                </Modal>

                <button onClick={toggleSafetyModal} className="safety-policy-button">
                  Safety
                </button>
                <Modal
                  isOpen={isSafetyModalOpen}
                  onRequestClose={toggleSafetyModal}
                  contentLabel="Safety Policy"
                >
                  <h2>Safety Policy l o l</h2>
                  {/* Add your Safety Policy content here */}
                  <button onClick={toggleSafetyModal}>Close</button>
                </Modal>
              </li>
              <li className="policy-buttons">
                <button onClick={toggleNotificationsModal} className="notifications-button">
                  Notifications
                </button>
                <Modal
                  isOpen={isNotificationsModalOpen}
                  onRequestClose={toggleNotificationsModal}
                  contentLabel="Notifications"
                >
                  <h2>Notification Settings</h2>
                  {/* Add your Notification Settings content here */}
                  <button onClick={toggleNotificationsModal}>Close</button>
                </Modal>

                <button onClick={togglePasswordModal} className="password-button">
                  Password
                </button>
                <Modal
                  isOpen={isPasswordModalOpen}
                  onRequestClose={togglePasswordModal}
                  contentLabel="Password"
                >
                  <h2>Password Settings</h2>
                  {/* Add your Password Settings content here */}
                  <button onClick={togglePasswordModal}>Close</button>
                </Modal>
              </li>
            </ul>
          </div>
        </li>
        {/* Other links and content */}
      </ul>
    </div>
  );
};

export default Settings;
