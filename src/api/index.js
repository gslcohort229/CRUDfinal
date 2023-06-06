export const fetchPosts = async (userId, start) => {
    // Replace this with your API call to fetch posts based on userId and start
    // For example:
    // const response = await fetch(`/api/posts?userId=${userId}&start=${start}`);
    // const data = await response.json();
    // return data;
  
    // For now, let's use dummy data
    const dummyPosts = [
      {
        id: 1,
        title: 'Post 1',
        content: 'This is a sample post.',
      },
      {
        id: 2,
        title: 'Post 2',
        content: 'This is another sample post.',
      },
    ];
  
    return new Promise((resolve) => {
      setTimeout(() => resolve(dummyPosts), 1000);
    });
  };
  