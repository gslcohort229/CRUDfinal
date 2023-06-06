import React, { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

const PostForm = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    let imageUrl = '';
    if (image) {
      const storageRef = ref(storage);
      const imageRef = ref(storageRef, `images/${image.name}`);
      await uploadBytesResumable(imageRef, image);
      imageUrl = await getDownloadURL(imageRef);
    }

    onSubmit(null, {
      title,
      content,
      imageUrl,
      // You might want to add more fields here, like the author's id, timestamp, etc.
    });

    // Reset the form
    setTitle('');
    setContent('');
    setImage(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
      />
      <input type="file" onChange={handleImageChange} />
      <button type="submit">Submit Post</button>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
};

export default PostForm;
