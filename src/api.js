import { collection, getDocs, addDoc, query, orderBy, startAfter } from 'firebase/firestore';
import { db } from './firebase';

export const fetchPosts = async ({ page, limit }) => {
  console.log('Fetching posts with page:', page, 'and limit:', limit);

  const postsRef = collection(db, 'posts');

  let q = query(postsRef, orderBy('timestamp'));
  if (page > 1) {
    console.log('Fetching posts for page > 1');

    const lastVisibleSnapshot = await getDocs(query(postsRef, orderBy('timestamp'), limit((page - 1) * limit)));
    const lastVisible = lastVisibleSnapshot.docs[lastVisibleSnapshot.docs.length - 1];
    q = query(postsRef, orderBy('timestamp'), startAfter(lastVisible), limit(limit));
  }

  const postsSnapshot = await getDocs(q);
  const posts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  console.log('Fetched posts:', posts);
  
  return posts;
};


export const createPost = async ({ title, content, imageUrl }) => {
  console.log('Creating post with title:', title, ', content:', content, ', imageUrl:', imageUrl);

  const newPostRef = await addDoc(collection(db, 'posts'), { title, content, imageUrl });
  console.log('New post id:', newPostRef.id);

  return newPostRef.id;
};
