import { collection, addDoc, doc, serverTimestamp, runTransaction } from 'firebase/firestore';
import { db, auth } from './firebase'; // replace './firebase' with the actual path to your Firebase initialization file

const findMatchingMessage = async (message, timeout) => {
  // Implement your matching algorithm here
  // This function should return the matching message if one is found, or null otherwise
}
export const handleMessage = async (message) => {
  try {
    const messagesRef = collection(db, 'messages');
    const messageDocRef = await addDoc(messagesRef, {
      content: message,
      timestamp: serverTimestamp(),
      userId: auth.currentUser.uid,
      matched: false
    });

    const result = await runTransaction(db, async (transaction) => {
      const match = await findMatchingMessage(message, 8);

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

        transaction.update(messageDocRef, {
          chatRoomId: chatRoomDocRef.id,
        });
        transaction.update(doc(db, 'messages', match.messageId), {
          chatRoomId: chatRoomDocRef.id,
        });

        transaction.delete(doc(db, 'unmatchedMessages', match.messageId));
        transaction.delete(doc(db, 'unmatchedMessages', messageDocRef.id));
      } else {
        const unmatchedMessagesRef = collection(db, 'unmatchedMessages');
        await addDoc(unmatchedMessagesRef, {
          ...message,
          messageId: messageDocRef.id,
        });
      }
    });
    console.log('Transaction successfully committed!', result);
  } catch (error) {
    console.error("Transaction failed: ", error);
  }
};
