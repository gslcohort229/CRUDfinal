import { collection, addDoc, doc, serverTimestamp, runTransaction, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db, auth } from './firebase'; // replace './firebase' with the actual path to your Firebase initialization file

const findMatchingMessage = async (message) => {
  // Current time minus 8 seconds
  const eightSecondsAgo = new Date(new Date() - 8000);

  // Search for a message with the same content, sent within the past 8 seconds
  const q = query(
    collection(db, 'unmatchedMessages'), 
    where('content', '==', message.content),
    where('timestamp', '>=', eightSecondsAgo),
    orderBy('timestamp', 'desc'), // order by timestamp descending
    limit(1) // get the most recent message if there's more than one
  );
  
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    // Return the first matching message
    return querySnapshot.docs[0].data();
  } else {
    // No matching message found
    return null;
  }
}

export const handleMessage = async (message, keepFor24Hours) => {
  try {
    const messagesRef = collection(db, 'messages');
    const messageDocRef = await addDoc(messagesRef, {
      content: message.content,
      timestamp: serverTimestamp(),
      userId: auth.currentUser.uid,
      displayName: auth.currentUser.displayName,
      matched: false
    });

    let isMatchFound = false; // flag to indicate if match is found

    const result = await runTransaction(db, async (transaction) => {
      const match = await findMatchingMessage(message);

      if (match) {
        const chatRoomsRef = collection(db, 'chatRooms');
        const chatRoomDocRef = await addDoc(chatRoomsRef, {
          users: [message.userId, match.userId],
          messages: [{
            messageId: messageDocRef.id,
            userId: message.userId,
            content: message.content,
            timestamp: serverTimestamp(),
          }]
        });

        isMatchFound = true; // set flag to true as match found

        transaction.update(messageDocRef, {
          chatRoomId: chatRoomDocRef.id,
        });
        transaction.update(doc(db, 'messages', match.messageId), {
          chatRoomId: chatRoomDocRef.id,
        });

        transaction.delete(doc(db, 'unmatchedMessages', match.messageId));
        transaction.delete(doc(db, 'unmatchedMessages', messageDocRef.id));
      } else if (keepFor24Hours) {
        const unmatchedMessagesRef = collection(db, 'unmatchedMessages');
        await addDoc(unmatchedMessagesRef, {
          ...message,
          displayName: auth.currentUser.displayName,
          messageId: messageDocRef.id,
        });
      }
    });
    console.log('Transaction successfully committed!', result);

    return isMatchFound; // return the flag
  } catch (error) {
    console.error("Transaction failed: ", error);
    throw error; // re-throw the error to be handled by the caller
  }
};
