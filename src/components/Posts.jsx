import React, { useState, useEffect, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Post from './Post';
import { fetchPosts } from '../api';

export const RecentPosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const loadRecentPosts = async () => {
      const response = await fetchPosts({ page: 1, limit: 3 });
      setPosts(response);
    };

    loadRecentPosts();
  }, []);

  return (
    <div className="posts">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadPosts = useCallback(async () => {
    const response = await fetchPosts({ page });
    if (response.length > 0) {
      setPosts((prevPosts) => [...prevPosts, ...response]);
      setPage((prevPage) => prevPage + 1);
    } else {
      setHasMore(false);
    }
  }, [page]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={loadPosts}
      hasMore={hasMore}
      loader={<h4>Loading...</h4>}
      endMessage={
        <p style={{ textAlign: 'center' }}>
          <b>Yay! You have seen it all</b>
        </p>
      }
    >
      <div className="posts">
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </InfiniteScroll>
  );
};

export const PostHistory = () => {
  return (
    <div>
      <h2>Post History</h2>
      <Posts />
    </div>
  );
};


export default Posts;







