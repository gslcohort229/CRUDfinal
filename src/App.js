import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { auth, signOut, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import Login from './Login';
import Home from './Home';
import List from './List';
import Profile from './Profile';
import Settings from './Settings';
import PrivacyPolicy from './PrivacyPolicy';
import PostDetails from './components/PostDetails';
import Chat from './Chat';
import { PostHistory } from './components/Posts';
import { ToastContainer } from 'react-toastify'



const App = () => {
  const [authStatus, setAuthStatus] = useState('loading');
  // declare the displayName state and its setter function
  const [displayName, setDisplayName] = useState(null);


  useEffect(() => {
    console.log('Starting authentication check');
  
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        console.log('User authenticated:', user);
  
        // Fetch user document from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
  
        if (userDoc.exists()) {
          // Get displayName from Firestore
          const displayNameFromFirestore = userDoc.data().displayName;
          console.log('Display Name from Firestore: ', displayNameFromFirestore);
  
          // Here you can set the displayName from Firestore to your app's state
          setDisplayName(displayNameFromFirestore);
        }
  
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

  console.log('displayName state set:', displayName);
  
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
      <ToastContainer /> 
      <Routes>{renderRoutes()}</Routes>
    </Router>
  );
};

export default App;
