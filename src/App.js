import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { auth, signOut } from './firebase';
import Login from './Login';
import Home from './Home';
import List from './List';
import Profile from './Profile';
import Settings from './Settings';
import PrivacyPolicy from './PrivacyPolicy';
import PostDetails from './components/PostDetails';
import Chat from './Chat';
import { PostHistory } from './components/Posts';


const App = () => {
  const [authStatus, setAuthStatus] = useState('loading');

  useEffect(() => {
    console.log('Starting authentication check');
  
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('User authenticated:', user);
  
        // code to check user's displayName
        console.log('User Display Name: ', user.displayName);
  
        // Set a flag in sessionStorage when the user is signed in
        sessionStorage.setItem('userIsActive', 'true');
        setAuthStatus('authenticated');
      } else {
        console.log('User not authenticated');
  
        // Check if the flag is set in sessionStorage
        const userIsActive = sessionStorage.getItem('userIsActive');
        if (!userIsActive) {
          console.log('User is not active in session storage, signing out');
  
          // If the flag is not set, sign the user out
          signOut(auth);
        }
        setAuthStatus('unauthenticated');
      }
    });
  
    return () => {
      console.log('Cleaning up onAuthStateChanged listener');
      unsubscribe();
    };
  }, []);
  

  // Function to handle manual sign out
  const handleSignOut = async () => {
    // Clear the flag from sessionStorage
    sessionStorage.removeItem('userIsActive');
    // Sign the user out
    await signOut(auth);
  };

  const renderRoutes = () => {
    if (authStatus === 'loading') {
      return null;
    }

    if (authStatus === 'authenticated') {
      return (
        <>
          <Route path="/" element={<Home handleSignOut={handleSignOut} />} />
          <Route path="/list" element={<List />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          {/* Add this route for the PostDetails component */}
          <Route path="/post-details/:postId" element={<PostDetails />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/post-history" element={<PostHistory />} />
        </>
      );
    }

    return <Route path="/" element={<Login />} />;
  };

  return (
    <Router>
      <Routes>{renderRoutes()}</Routes>
    </Router>
  );
};

export default App;
