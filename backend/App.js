// backend/app.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;

// Dummy data for posts (replace this with your own data or connect to a database)
let posts = [
  {
    id: 1,
    title: 'Photo Post 1',
    mediaType: 'photo',
    mediaUrl: 'https://example.com/photo1.jpg',
    description: 'This is a photo post',
    location: 'New York',
    tags: ['nature', 'photography'],
    likes: 10,
  },
  {
    id: 2,
    title: 'Video Post 1',
    mediaType: 'video',
    mediaUrl: 'https://example.com/video1.mp4',
    description: 'This is a video post',
    location: 'San Francisco',
    tags: ['travel', 'adventure'],
    likes: 5,
  },
];

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API routes
app.get('/posts', (req, res) => {
  res.json(posts);
});

app.get('/posts/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find((p) => p.id === postId);
  if (!post) {
    res.status(404).json({ message: 'Post not found' });
  } else {
    res.json(post);
  }
});

app.post('/posts/:id/like', (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find((p) => p.id === postId);
  if (!post) {
    res.status(404).json({ message: 'Post not found' });
  } else {
    post.likes += 1;
    res.json({ message: 'Post liked successfully' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
