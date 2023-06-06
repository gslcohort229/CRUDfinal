import { collection, getDocs, getDoc, deleteDoc, doc, query, where, orderBy, limit } from 'firebase/firestore';
import { db, auth } from './firebase.js'; // update this line

export async function findMatchingMessage(currentMessage, windowSeconds) {
  const currentUserUid = auth.currentUser.uid;
  const currentMessageRef = doc(db, 'messages', currentMessage.id);
  const currentMessageDoc = await getDoc(currentMessageRef);
  const currentMessageData = currentMessageDoc.data();

  const currentUserRef = doc(db, 'users', currentUserUid);
  const currentUserDoc = await getDoc(currentUserRef);
  const currentUserData = currentUserDoc.data();

  const unmatchedMessagesRef = collection(db, 'unmatchedMessages');
  const q = query(
    unmatchedMessagesRef,
    where('timestamp', '>=', Date.now() - 24*60*60*1000),
    orderBy('timestamp', 'desc'),
    limit(100)  // Limit the number of documents to avoid retrieving a large number of documents
  );
  const unmatchedMessagesSnapshot = await getDocs(q);
  const unmatchedMessages = unmatchedMessagesSnapshot.docs.map(doc => doc.data());
  for (const messageObj of unmatchedMessages) {
    const otherUserRef = doc(db, 'users', messageObj.userId);
    const otherUserDoc = await getDoc(otherUserRef);
    const otherUserData = otherUserDoc.data();

    if (
      messageObj.userId !== currentUserUid &&
      isWithinTimeWindowSeconds(messageObj.timestamp, currentMessage.timestamp, windowSeconds) &&
      otherUserData.preferences.some((preference) => currentUserData.preferences.includes(preference)) &&
      messageObj.postId === currentMessageData.postId
    ) {
      // Remove the matched message from the unmatchedMessages collection
      await deleteDoc(doc(db, 'unmatchedMessages', messageObj.id));
      return messageObj;
    }
  }

  return null;
}

// Assuming you have a function like this
function isWithinTimeWindowSeconds(timestamp1, timestamp2, windowSeconds) {
  return Math.abs(timestamp1 - timestamp2) <= windowSeconds * 1000;
}
