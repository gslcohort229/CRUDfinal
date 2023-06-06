import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';
import { auth, db } from './firebase';
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  getDocs,
  updateDoc,
  arrayUnion,
  arrayRemove,
  query,
  where,
  deleteDoc,
  getDoc,
  setDoc,
} from 'firebase/firestore';

const Home = ({ handleSignOut }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [message, setMessage] = useState('');
  const [hasUnmatchedMessage, setHasUnmatchedMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userRef = doc(db, 'users', auth.currentUser.uid);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists() && doc.data().unmatchedMessages) {
        setHasUnmatchedMessage(doc.data().unmatchedMessages.length > 0);
      } else {
        setHasUnmatchedMessage(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter' && message.trim() && !hasUnmatchedMessage) {
      e.preventDefault();
      await handleMessage();
    }
  };

  const isWithinTimeWindowSeconds = (timestamp1, timestamp2, windowInSeconds) => {
    return Math.abs(timestamp1 - timestamp2) <= windowInSeconds * 1000;
  };

    const handleMessage = async () => {
      const currentMessage = {
          content: message,
          timestamp: Date.now(),
          userId: auth.currentUser.uid,
          displayName: auth.currentUser.displayName,
          matched: false,
      };
  
      const localMatchedUsers = [];
      const currentUserUid = auth.currentUser.uid;
  
      const unmatchedQuerySnapshot = await getDocs(
          query(collection(db, 'unmatchedMessages'), where('content', '==', currentMessage.content))
      );
  
      const unmatchedMessages = unmatchedQuerySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  
      // Add a document for the currentMessage object
      const currentMessageDocRef = await addDoc(collection(db, 'messages'), currentMessage);
      const currentMessageId = currentMessageDocRef.id;
  
      for (const messageObj of unmatchedMessages) {
          if (
              messageObj.userId !== currentUserUid &&
              isWithinTimeWindowSeconds(messageObj.timestamp, currentMessage.timestamp, 24 * 60 * 60)
          ) {
              localMatchedUsers.push(messageObj.userId);
  
              const messageRef = doc(db, 'messages', messageObj.id);
              const docSnap = await getDoc(messageRef);
              
              if (docSnap.exists()) {
                  // If the document exists, update it
                  await updateDoc(messageRef, { matched: true });
              } else {
                  console.error(`No document found with id: ${messageObj.id}`);
              }
              
              const currentMessageRef = doc(db, 'messages', currentMessageId);
              const currentDocSnap = await getDoc(currentMessageRef);
              
              if (currentDocSnap.exists()) {
                  // If the document exists, update it
                  await updateDoc(currentMessageRef, { matched: true });
              } else {
                  console.error(`No document found with id: ${currentMessageId}`);
              }
  
              await deleteDoc(doc(db, 'unmatchedMessages', messageObj.id));
    
              await updateDoc(doc(db, 'users', messageObj.userId), {
                unmatchedMessages: arrayRemove(messageObj),
              });
    
              await updateDoc(doc(db, 'users', currentUserUid), {
                unmatchedMessages: arrayRemove(currentMessage),
              });
  
              const currentTimeStamp = new Date();
  
              const chatRoomData = {
                  users: [currentUserUid, messageObj.userId],
              };
              const docRef = await addDoc(collection(db, "chatRooms"), chatRoomData);
      
              await updateDoc(docRef, {
                messages: [{
                  content: currentMessage.content,
                  timestamp: currentTimeStamp,
                  userId: currentUserUid,
                }],
              });
    
              const chatRoomId = docRef.id;
          
              await updateDoc(doc(db, 'users', currentUserUid), {
                chatRooms: arrayUnion(chatRoomId),
              });
              await updateDoc(doc(db, 'users', messageObj.userId), {
                chatRooms: arrayUnion(chatRoomId),
              });
  
              navigate('/chat/' + chatRoomId);
          }
      }
  
    if (localMatchedUsers.length === 0) {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userDoc = await getDoc(userRef);
    
      if (!userDoc.exists()) {
        try {
          await setDoc(userRef, { unmatchedMessages: [currentMessage] });
        } catch (e) {
          console.error('Error creating document:', e);
        }
      } else {
        try {
          await updateDoc(userRef, { unmatchedMessages: arrayUnion(currentMessage) });
        } catch (e) {
          console.error('Error updating document:', e);
        }
      }
    
      const unmatchedMessageRef = collection(db, 'unmatchedMessages');
      await addDoc(unmatchedMessageRef, currentMessage);
    }

    setMessage('');
  };

  return (
    <div className="home-container">
      <div className="navbar">
        <div className="dropdown">
          <button onClick={() => setShowDropdown(!showDropdown)} className="dropbtn">
            Your Stuff
          </button>
          {showDropdown && (
            <div className="dropdown-content">
              <Link to="/profile">My Profile</Link>
              <Link to="/settings">Settings</Link>
              <button onClick={handleSignOut}>Sign Out</button>
            </div>
          )}
        </div>
      </div>

      <div className="background-circle">
        <textarea
          className="message-input"
          placeholder="What are you thinking?"
          value={message}
          onChange={handleMessageChange}
          onKeyDown={handleKeyPress}
        />
      </div>
    </div>
  );
};

export default Home;

