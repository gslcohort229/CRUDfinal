import React from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const Profileinfo = ({ user }) => {
  const [displayName, setDisplayName] = React.useState('');

  React.useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const docRef = doc(getFirestore(), 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setDisplayName(docSnap.data().displayName);
        } else {
          console.log('No such document!');
        }
      }
    };

    fetchUserData();
  }, [user]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Welcome, {displayName}</h2>
    </div>
  );
};

export default Profileinfo;
