// src/app/blog/[id]/page.tsx
// Dies ist eine Server-Komponente (kein 'use client' am Anfang)

// Importiere die Firestore-Instanzen
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';

// Importiere die neue Client-Komponente
import BlogPostDetailClient from '@/components/BlogPostDetailClient';

// Definiere den Typ für einen Blogpost
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

// generateStaticParams Funktion für statischen Export
// Diese Funktion wird zur Build-Zeit auf dem Server ausgeführt, um alle möglichen Blogpost-IDs zu ermitteln
export async function generateStaticParams() {
  const querySnapshot = await getDocs(collection(db, 'blogPosts'));
  
  const params = querySnapshot.docs.map(doc => ({
    id: doc.id,
  }));

  return params;
}

// Die Page-Komponente ist jetzt eine Server-Komponente
export default async function BlogPostDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;

  let blogPost: BlogPost | null = null;
  let error: string = '';
  let loading: boolean = true;

  try {
    const docRef = doc(db, 'blogPosts', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      blogPost = { id: docSnap.id, ...docSnap.data() as Omit<BlogPost, 'id'> };
    } else {
      error = 'Blogpost nicht gefunden.';
    }
  } catch (err: unknown) {
    console.error('Fehler beim Laden des Blogposts:', err);
    if (err instanceof Error) {
      error = 'Fehler beim Laden des Blogposts: ' + err.message;
    } else {
      error = 'Ein unbekannter Fehler ist aufgetreten.';
    }
  } finally {
    loading = false;
  }

  // Rendere die Client-Komponente und übergebe die Daten als Props
  return (
    <BlogPostDetailClient blogPost={blogPost} loading={loading} error={error} />
  );
}
