import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, storage } from '../firebase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const PostDetails = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const postRef = doc(db, 'posts', postId);
      const postDoc = await getDoc(postRef);
      if (postDoc.exists()) {
        setPost(postDoc.data());
        setTitle(postDoc.data().title);
        setContent(postDoc.data().content);
      }
    };
    fetchPost();
  }, [postId]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    let imageUrl = post.imageUrl;
    if (image) {
      const storageRef = ref(storage);
      const imageRef = ref(storageRef, `images/${image.name}`);
      await uploadBytesResumable(imageRef, image);
      imageUrl = await getDownloadURL(imageRef);
    }

    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, { title, content, imageUrl });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    const postRef = doc(db, 'posts', postId);
    await deleteDoc(postRef);
    navigate('/');
 // Redirect to the home page after deletion
  }; const handleImageChange = (e) => {
    if (e.target.files[0]) {
    setImage(e.target.files[0]);
    }
    };
    
    if (!post) return null;
    
    return (
    <div>
    {isEditing ? (
    <>
    <input
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    />
    <textarea
    value={content}
    onChange={(e) => setContent(e.target.value)}
    />
    <input type="file" onChange={handleImageChange} />
    <button onClick={handleSave}>Save</button>
    </>
    ) : (
    <>
    <h3>{post.title}</h3>
    <p>{post.content}</p>
    {post.imageUrl && <img src={post.imageUrl} alt="post" />}
    <button onClick={handleEdit}>Edit</button>
    </>
    )}
    <button onClick={handleDelete}>Delete</button>
    </div>
    );
    };
    
    export default PostDetails;

