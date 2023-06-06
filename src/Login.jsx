import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebase';
import { setDoc, getDoc, doc } from 'firebase/firestore';
import { query, collection, where, getDocs } from 'firebase/firestore';
import './Login.css';
import { sendEmailVerification } from "firebase/auth";

const Login = ({ resetState }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!email || !password || !displayName) {
      setError('Please fill out all fields');
      return;
    }
  
    setError('');

    // check if displayName already exists in Firestore
    const displayNameSnapshot = await getDocs(
      query(collection(db, 'users'), where('displayName', '==', displayName))
    );

    if (!displayNameSnapshot.empty) {
      setError('Display name already exists');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      sendEmailVerification(user) // send verification email
        .then(() => {
          console.log("Verification email sent!");
        })
        .catch((error) => {
          console.log("Error sending verification email: ", error);
        });
        
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: displayName,
        unmatchedMessages: [],
      });

      console.log('displayName to set:', displayName); // New logging
      await user.updateProfile({
        displayName: displayName,
      });
      await user.reload();
      console.log('displayName after updateProfile:', user.displayName); // New logging

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      console.log(userDoc.data());

      resetState(); 
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
  
    if (!email || !password) { 
      setError('Please fill out all fields');
      return;
    }
    setError('');
    
    try {
      let signInEmail = email;
    
      if (!email.includes('@')) {
        const querySnapshot = await getDocs(
          query(collection(db, 'users'), where('displayName', '==', email))
        );
    
        if (!querySnapshot.empty) {
          signInEmail = querySnapshot.docs[0].data().email;
        } else {
          throw new Error('displayName not found');
        }
      }
    
      const userCredential = await signInWithEmailAndPassword(auth, signInEmail, password);
      let user = userCredential.user;
  
      // Check if email is verified
      if (!user.emailVerified) {
        throw new Error('Please verify your email before signing in');
      }
    
      const querySnapshot = await getDocs(
        query(collection(db, 'users'), where('email', '==', signInEmail))
      );
      if (!querySnapshot.empty) {
        const displayName = querySnapshot.docs[0].data().displayName;
        console.log('displayName to set during sign in:', displayName); // New logging
        await user.updateProfile({
          displayName: displayName,
        });
        await user.reload(); // reload user data
  
        // Re-fetch user data
        user = auth.currentUser;
      }
    
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      console.log('displayName from Firestore:', userDoc.data().displayName); // Fetch displayName from Firestore
    
      resetState();
    } catch (error) {
      setError(error.message);
    }
  };
  
  
  return (
    <div className='login-page'>
      <div className="form-container" style={{ backgroundImage: "url('/background1.jpg')" }}>
        <div className="headings-container">
        <h1 className="title">
          <span className="white-letter">b</span>
          <span className="maze-letters">maze</span>
          <span className="white-letter">d</span>
        </h1>
        </div>
        <form>
          <input
            type="email"
            placeholder="Email or Display Name"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {isSignUp && (
            <input
              type="text"
              placeholder="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          )}
          <button onClick={handleSignIn} onFocus={() => setIsSignUp(false)}>Sign In</button>
          <button onClick={handleSignUp} onFocus={() => setIsSignUp(true)}>Sign Up</button>
        </form>
        {error && <p>{error}</p>}
      </div>
      <div className="background-container" style={{ backgroundImage: "url('/background2.jpg')" }}></div>
    </div>
  );
};

export default Login;

