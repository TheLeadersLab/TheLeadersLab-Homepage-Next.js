// src/components/BlogPostList.tsx
'use client'; // Dies ist ein Client Component

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase'; // Importiere die Firestore-Instanz
import { collection, query, orderBy, onSnapshot, DocumentData } from 'firebase/firestore';
import Link from 'next/link'; // Importiere Next.js Link-Komponente

// Definiere den Typ für einen Blogpost
interface BlogPost {
  id: string; // Die Dokument-ID von Firestore
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
    // Erstelle eine Abfrage für die 'blogPosts'-Sammlung, sortiert nach Erstellungsdatum absteigend
    // HINWEIS: orderBy() kann in Firestore zu Index-Fehlern führen, wenn kein Index existiert.
    // Für einfache Sortierung können wir Daten nach dem Abrufen im Client sortieren.
    // Wenn du orderBy() verwenden möchtest und Fehler bekommst, musst du einen Index in Firebase anlegen.
    const q = query(collection(db, 'blogPosts'), orderBy('createdAt', 'desc'));

    // onSnapshot liefert Echtzeit-Updates
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const posts: BlogPost[] = [];
      querySnapshot.forEach((doc) => {
        // Füge die Dokument-ID zum Datenobjekt hinzu
        posts.push({ id: doc.id, ...doc.data() as Omit<BlogPost, 'id'> });
      });
      setBlogPosts(posts);
      setLoading(false);
    }, (err) => {
      console.error('Fehler beim Laden der Blogposts:', err);
      setError('Fehler beim Laden der Blogposts: ' + err.message);
      setLoading(false);
    });

    // Cleanup-Funktion: Listener entfernen, wenn die Komponente unmounted wird
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="text-center py-8 text-gray-700">Lade Blogposts...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Fehler: {error}</div>;
  }

  if (blogPosts.length === 0) {
    return <div className="text-center py-8 text-gray-700">Noch keine Blogposts vorhanden.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-[#262b5e] mb-8 text-center">Neueste Blogposts</h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <div key={post.id} className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col">
            {post.youtubeLink && (
              <div className="relative w-full aspect-video">
                {/* Einfache YouTube-Einbettung */}
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
                {post.createdAt ? new Date(post.createdAt.seconds * 1000).toLocaleDateString('de-DE') : 'Datum unbekannt'}
                {post.authorEmail && ` von ${post.authorEmail}`}
              </p>
              <p className="text-gray-700 mb-4 line-clamp-3">{post.content}</p> {/* Zeigt nur 3 Zeilen Inhalt */}
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
              {/* Hier wird der "Weiterlesen"-Button mit einem Link zur Detailseite versehen */}
              <Link href={`/blog/${post.id}`} className="text-[#262b5e] hover:underline font-medium">
                Weiterlesen &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPostList;