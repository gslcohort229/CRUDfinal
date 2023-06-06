import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import {
  doc,
  collection,
  addDoc,
  onSnapshot
} from 'firebase/firestore';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  useEffect(() => {
    console.log("Current user:", auth.currentUser);
  }, []);

  const location = useLocation();
  const chatRoomId = location.state?.chatRoomId;

  const navigate = useNavigate();
  
  console.log("Chat room ID:", chatRoomId);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'chatRooms', chatRoomId, 'messages'),
      (snapshot) => {
        let fetchedMessages = [];
        snapshot.forEach((doc) => {
          fetchedMessages.push(doc.data());
        });
        setMessages(fetchedMessages);
      },
    );

    return () => unsubscribe();
  }, [chatRoomId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (inputMessage.trim() === '') return;

    const message = {
      content: inputMessage,
      timestamp: new Date(),
      userId: auth.currentUser.uid,
      displayName: auth.currentUser.displayName,
      chatRoomId: chatRoomId,
    };

    console.log("Sending message:", message);

    try {
      const chatRoomRef = doc(db, 'chatRooms', chatRoomId);
      await addDoc(collection(chatRoomRef, 'messages'), message);
    } catch (error) {
      console.error("Failed to send message:", error);
    }

    setInputMessage('');
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };

  if (!chatRoomId) { 
    navigate("/");
    return null;
  }

  return (
    <div>
      <h1>Chat</h1>
      <ul>
      {messages.map((message) => (
  <li key={message.id}>
    {message.userId}: {message.content}
  </li>
))}
      </ul>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Type your message"
          value={inputMessage}
          onChange={handleInputChange}
        />
        <button type="submit">Send</button>
      </form>
      <Link to="/">
        <button>Exit/Disconnect</button>
      </Link>
    </div>
  );
};

export default Chat;
