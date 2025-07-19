// src/components/BlogPostDetailClient.tsx
'use client'; // Dies ist eine Client-Komponente

import React from 'react';
import Link from 'next/link';

// Definiere den Typ für einen Blogpost (muss hier wiederholt werden oder aus einer gemeinsamen Datei importiert werden)
interface BlogPost {
  id: string;
  title: string;
  content: string;
  youtubeLink?: string;
  tags?: string[];
  authorEmail?: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  }; // Firestore Timestamp
}

interface BlogPostDetailClientProps {
  blogPost: BlogPost | null;
  loading: boolean;
  error: string;
}

const BlogPostDetailClient: React.FC<BlogPostDetailClientProps> = ({ blogPost, loading, error }) => {

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center py-8 text-gray-700">Lade Blogpost...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center py-8 text-red-600">Fehler: {error}</div>
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center py-8 text-gray-700">Blogpost nicht verfügbar.</div>
      </div>
    );
  }

  // Hilfsfunktion, um den YouTube-Video-ID aus verschiedenen URL-Formaten zu extrahieren
  const getYouTubeVideoId = (url: string): string | null => {
    const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([\w-]{11})(?:\S+)?/;
    const match = url.match(regExp);
    return (match && match[1].length === 11) ? match[1] : null;
  };

  const videoId = blogPost.youtubeLink ? getYouTubeVideoId(blogPost.youtubeLink) : null;

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white shadow-lg rounded-lg p-8">
        <Link href="/" className="text-[#262b5e] hover:underline mb-4 block">
          &larr; Zurück zur Übersicht
        </Link>
        <h1 className="text-4xl font-extrabold text-[#262b5e] mb-4">{blogPost.title}</h1>
        <p className="text-gray-600 text-sm mb-6">
          {blogPost.createdAt ? new Date(blogPost.createdAt.seconds * 1000).toLocaleDateString('de-DE') : 'Datum unbekannt'}
          {blogPost.authorEmail && ` von ${blogPost.authorEmail}`}
        </p>

        {videoId && (
          <div className="relative w-full aspect-video mb-6 rounded-lg overflow-hidden">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={blogPost.title}
            ></iframe>
          </div>
        )}

        <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed mb-6">
          {/* Hier könnte ein Markdown-Renderer verwendet werden, um den Inhalt zu formatieren */}
          <p>{blogPost.content}</p>
        </div>

        {blogPost.tags && blogPost.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {blogPost.tags.map((tag, index) => (
              <span key={index} className="bg-[#e0a32f] text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPostDetailClient;