import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import { initializeApp } from 'firebase/app'; // Import initializeApp from 'firebase/app'
//import { getAuth, GoogleAuthProvider, FacebookAuthProvider, TwitterAuthProvider } from 'firebase/auth'; // Import the specific authentication providers

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'; // Import Firebase Authentication module
import { BrowserRouter as Router,  Route,Routes, Link } from 'react-router-dom';
import './App.css';

// Initialize Firebase with your Firebase config
const firebaseConfig = {
  apiKey: 'AIzaSyB1SeLU8pIFIUBsOpiPDP32JOIlaTn3a6Q',
  authDomain: 'social-app-a83cb.firebaseapp.com',
  projectId: 'social-app-a83cb',
  appId: '1:790785712328:web:2022fb83e42d38f8b005fd',
};

firebase.initializeApp(firebaseConfig); // Initialize Firebase app first

const auth = firebase.auth(); // Get the Firebase Auth instance


//const firebaseApp = initializeApp(firebaseConfig); // Initialize the Firebase app

//const auth = getAuth(firebaseApp); // Get the Firebase Auth instance
//firebase.initializeApp(firebaseConfig);

const API_BASE_URL = 'http://localhost:5000';

const App = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
    // Listen for Firebase authentication state changes
    const unsubscribe = firebase.auth().onAuthStateChanged((userFromFirebase) => {
      if (userFromFirebase) {
        // If user is logged in, set the user state
        setUser(userFromFirebase);
      } else {
        // If user is logged out, set the user state to null
        setUser(null);
      }
    });

    return () => unsubscribe(); // Clean up the listener when the component unmounts
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/posts`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      let authProvider;
      switch (provider) {
        case 'google':
          authProvider = new firebase.auth.GoogleAuthProvider();
          break;
        case 'facebook':
          authProvider = new firebase.auth.FacebookAuthProvider();
          break;
        case 'twitter':
          authProvider = new firebase.auth.TwitterAuthProvider();
          break;
        default:
          return;
      }

      // Sign in with the selected provider
      await firebase.auth().signInWithPopup(authProvider);
    } catch (error) {
      console.error('Error signing in with social provider:', error);
    }
  };

  const handleLogout = async () => {
    try {
      // Sign out the user
      await firebase.auth().signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      // API call to like the post
      await axios.post(`${API_BASE_URL}/posts/${postId}/like`);
      // Fetch the updated list of posts after like
      fetchPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  return (
    <Router>
      <div className="App">
        <header>
          {user ? (
            // If user is logged in, show logout button
            <button onClick={handleLogout}>Logout</button>
          ) : (
            // If user is not logged in, show social login buttons
            <div>
              <button onClick={() => handleSocialLogin('google')}>Sign in with Google</button>
              <button onClick={() => handleSocialLogin('facebook')}>Sign in with Facebook</button>
              <button onClick={() => handleSocialLogin('twitter')}>Sign in with Twitter</button>
            </div>
          )}
        </header>
        <Routes>
          <Route exact path="/" element={
            <PostWall posts={posts} handleLike={handleLike} />} />
          
          <Route path="/post/:id" element={
            <PostDetail posts={posts} />} />
          
        </Routes>
      </div>
    </Router>
  );
};

const PostWall = ({ posts, handleLike }) => {
  return (
    <div className="post-wall">
      {posts.map((post) => (
        <PostItem key={post.id} post={post} handleLike={handleLike} />
      ))}
    </div>
  );
};

const PostItem = ({ post, handleLike }) => {
  return (
    <div className="post-item">
      {post.mediaType === 'photo' ? (
        // Display photo post
        <Link to={`/post/${post.id}`}>
          <img src={post.mediaUrl} alt={post.title} />
        </Link>
      ) : (
        // Display video post
        <Link to={`/post/${post.id}`}>
          <video controls poster={post.mediaUrl}>
            <source src={post.mediaUrl} type="video/mp4" />
          </video>
        </Link>
      )}
      <div className="post-info">
        <h3>{post.title}</h3>
        <p>{post.description}</p>
        <p>Location: {post.location}</p>
        <p>Tags: {post.tags.join(', ')}</p>
        <button onClick={() => handleLike(post.id)}>Like ({post.likes})</button>
      </div>
    </div>
  );
};

const PostDetail = ({ posts }) => {
  // Get the post ID from the URL params
  const postId = window.location.pathname.split('/').pop();
  const post = posts.find((p) => p.id.toString() === postId);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="post-detail">
      <h3>{post.title}</h3>
      {post.mediaType === 'photo' ? (
        // Display photo post in enlarged format
        <img src={post.mediaUrl} alt={post.title} />
      ) : (
        // Display video post in full-screen view
        <video controls>
          <source src={post.mediaUrl} type="video/mp4" />
        </video>
      )}
      <p>{post.description}</p>
      <p>Location: {post.location}</p>
      <p>Tags: {post.tags.join(', ')}</p>
    </div>
  );
};

export default App;