// src/components/AddBlogPostForm.tsx
'use client'; // This is a Client Component

import React, { useState } from 'react';
import { db } from '@/lib/firebase'; // Import the Firestore instance - Pfad angepasst
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext'; // Import the Auth context - Pfad angepasst
import { useRouter } from 'next/navigation'; // For navigation after posting

const AddBlogPostForm: React.FC = () => {
  const { currentUser, login, logout, loading: authLoading } = useAuth(); // Get the current user and auth functions
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [tags, setTags] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const router = useRouter(); // Initialize the router

  // Function to add a new blog post
  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError('You must be logged in to add a blog post.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Add the blog post to the 'blogPosts' collection in Firestore
      await addDoc(collection(db, 'blogPosts'), {
        title,
        content,
        youtubeLink,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0), // Save tags as an array
        authorId: currentUser.uid, // Save the author's ID
        authorEmail: currentUser.email, // Save the author's email
        createdAt: serverTimestamp(), // Firestore timestamp for creation time
      });

      setSuccess('Blog post successfully added!');
      setTitle('');
      setContent('');
      setYoutubeLink('');
      setTags('');

      // Optional: Trigger Netlify rebuild (advanced, here as comment only)
      // For an automatic rebuild after each post, a Netlify Build Hook
      // would need to be triggered via a Firebase Cloud Function. This is more complex.
      // For now, you can manually trigger the deploy or wait a while.
      // Or you can make a simple fetch call to a Build Hook here,
      // but that would expose the Build Hook in the frontend, which is not ideal.
      // const netlifyBuildHook = 'YOUR_NETLIFY_BUILD_HOOK_URL'; // REPLACE THIS!
      // await fetch(netlifyBuildHook, { method: 'POST' });
      // console.log('Netlify Build Hook triggered!');

      // Optional: Reload page or navigate to another page to see changes
      // router.refresh(); // Only for Next.js App Router, to reload data
      // router.push('/themen'); // Or navigate to the themes page
      
    } catch (err: any) {
      console.error('Error adding blog post:', err.message);
      setError('Error adding blog post: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to log in
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      setSuccess('Successfully logged in!');
    } catch (err: any) {
      setError('Login error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // If the authentication status is still loading
  if (authLoading) {
    return <div className="text-center py-8 text-gray-700">Loading authentication status...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg my-8">
      <h2 className="text-3xl font-bold text-[#262b5e] mb-6 text-center">Add Blog Post</h2>

      {!currentUser ? (
        // Login form, if not logged in
        <form onSubmit={handleLogin} className="space-y-4">
          <p className="text-gray-700 text-center mb-4">Please log in to add a blog post.</p>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#e0a32f] focus:border-[#e0a32f] sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#e0a32f] focus:border-[#e0a32f] sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#e0a32f] text-white py-2 px-4 rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e0a32f] transition duration-150 ease-in-out font-semibold"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
          {error && <p className="text-red-600 text-sm mt-2 text-center">{error}</p>}
        </form>
      ) : (
        // Blog post form, if logged in
        <form onSubmit={handleAddPost} className="space-y-4">
          <p className="text-gray-700 text-center mb-4">Logged in as: <span className="font-semibold text-[#262b5e]">{currentUser.email}</span></p>
          <button
            onClick={logout}
            className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition duration-150 ease-in-out font-semibold mb-4"
            disabled={loading}
          >
            Log Out
          </button>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Blog Post Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#e0a32f] focus:border-[#e0a32f] sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#e0a32f] focus:border-[#e0a32f] sm:text-sm"
            ></textarea>
          </div>
          <div>
            <label htmlFor="youtubeLink" className="block text-sm font-medium text-gray-700 mb-1">YouTube Video Link (optional)</label>
            <input
              type="url"
              id="youtubeLink"
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#e0a32f] focus:border-[#e0a32f] sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated, e.g., Leadership, Communication)</label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#e0a32f] focus:border-[#e0a32f] sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#262b5e] text-white py-2 px-4 rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#262b5e] transition duration-150 ease-in-out font-semibold"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Add Blog Post'}
          </button>
          {error && <p className="text-red-600 text-sm mt-2 text-center">{error}</p>}
          {success && <p className="text-green-600 text-sm mt-2 text-center">{success}</p>}
        </form>
      )}
    </div>
  );
};

export default AddBlogPostForm;