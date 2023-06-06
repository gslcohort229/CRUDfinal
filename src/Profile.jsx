import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from './firebase';
import {
  doc,
  onSnapshot,
  updateDoc,
  getDoc,
  addDoc,
  collection,
} from 'firebase/firestore';

import ProfileInfo from './components/ProfileInfo';
import { RecentPosts } from './components/Posts';
import Inbox from './components/Inbox';
import Followers from './components/followers';
import PostForm from './components/PostForm'; // Import the PostForm component
import './styles.css';

const Profile = () => {
  const [unmatchedMessages, setUnmatchedMessages] = useState([]);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    if (!auth.currentUser) {
      return;
    }

    const userRef = doc(db, 'users', auth.currentUser.uid);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setUnmatchedMessages(data && data.unmatchedMessages ? data.unmatchedMessages : []);
        setDisplayName(data.displayName);
        setBio(data.bio);
      } else {
        setUnmatchedMessages([]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handlePostSubmit = async (postId, post) => {
    // If a postId is provided, update the existing post
    if (postId) {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, post);
    } else {
      // Otherwise, create a new post
      console.log(post)
      await addDoc(collection(db, 'posts'), post);
    }
  };

  const handlePostCancel = () => {
    // Reset the form (or any other action you want to take when cancel is clicked)
  };

  const deleteUnmatchedMessage = async (message) => {
    try {
      if (!message) {
        return;
      }
  
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userDoc = await getDoc(userRef);
      const unmatchedMessages = userDoc.data().unmatchedMessages;
  
      if (unmatchedMessages) {
        const newUnmatchedMessages = unmatchedMessages.filter(
          (msg) => msg.content !== message.content
        );
  
        await updateDoc(userRef, {
          unmatchedMessages: newUnmatchedMessages,
        });
      }
    } catch (error) {
      console.error('Error deleting unmatched message:', error);
    }
  };
  

  if (!auth.currentUser) {
    return (
      <div>
        <p>Please sign in to view your profile.</p>
        <Link to="/login">
          <button>Sign In</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="profile">
      <h1>My Profile</h1>
      <Link to="/">
        <button className="home-button">home</button>
      </Link>
      <ProfileInfo displayName={displayName} bio={bio} />
      <PostForm onSubmit={handlePostSubmit} onCancel={handlePostCancel} /> {/* Add this line */}
      <RecentPosts />
      <Inbox />
      <Followers />
      <div className="unmatched-messages">
      <h2>Unmatched Messages:</h2>
        <ul>
          {unmatchedMessages.map((message, index) => (
            <li key={index}>
              <p>Timestamp: {new Date(message.timestamp).toLocaleString()}</p>
              <p>Content: {message.content}</p>
              <button onClick={() => deleteUnmatchedMessage(message)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Profile;

