// src/components/BlogPostList.tsx
'use client'; // This is a Client Component

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase'; // Import the Firestore instance - Pfad angepasst
import { collection, query, orderBy, onSnapshot, DocumentData } from 'firebase/firestore';

// Define the type for a blog post
interface BlogPost {
  id: string; // The document ID from Firestore
  title: string;
  content: string;
  youtubeLink?: string; // Optional
  tags?: string[]; // Optional
  authorEmail?: string; // Optional
  createdAt: {
    seconds: number;
    nanoseconds: number;
  }; // Firestore Timestamp
}

const BlogPostList: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Create a query for the 'blogPosts' collection, sorted by creation date descending
    // NOTE: orderBy() can lead to index errors in Firestore if no index exists.
    // For simple sorting, we can sort data client-side after fetching.
    // If you want to use orderBy() and get errors, you need to create an index in Firebase.
    const q = query(collection(db, 'blogPosts'), orderBy('createdAt', 'desc'));

    // onSnapshot provides real-time updates
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const posts: BlogPost[] = [];
      querySnapshot.forEach((doc) => {
        // Add the document ID to the data object
        posts.push({ id: doc.id, ...doc.data() as Omit<BlogPost, 'id'> });
      });
      setBlogPosts(posts);
      setLoading(false);
    }, (err) => {
      console.error('Error loading blog posts:', err);
      setError('Error loading blog posts: ' + err.message);
      setLoading(false);
    });

    // Cleanup function: Remove the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="text-center py-8 text-gray-700">Loading blog posts...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Error: {error}</div>;
  }

  if (blogPosts.length === 0) {
    return <div className="text-center py-8 text-gray-700">No blog posts yet.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-[#262b5e] mb-8 text-center">Latest Blog Posts</h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <div key={post.id} className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col">
            {post.youtubeLink && (
              <div className="relative w-full aspect-video">
                {/* Simple YouTube embed */}
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${post.youtubeLink.split('v=')[1]?.split('&')[0]}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={post.title}
                ></iframe>
              </div>
            )}
            <div className="p-6 flex-grow">
              <h3 className="text-xl font-semibold text-[#262b5e] mb-2">{post.title}</h3>
              <p className="text-gray-600 text-sm mb-3">
                {post.createdAt ? new Date(post.createdAt.seconds * 1000).toLocaleDateString('de-DE') : 'Date unknown'}
                {post.authorEmail && ` by ${post.authorEmail}`}
              </p>
              <p className="text-gray-700 mb-4 line-clamp-3">{post.content}</p> {/* Shows only 3 lines of content */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="bg-[#e0a32f] text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="p-6 pt-0">
              {/* Here could be a "Read more" button */}
              <button className="text-[#e0a32f] hover:underline font-medium">
                Read more &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPostList;
