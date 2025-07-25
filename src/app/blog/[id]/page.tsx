// src/app/blog/[id]/page.tsx
// Dies ist eine Server-Komponente (kein 'use client' am Anfang)

// Importiere die Firestore-Instanzen für den Server
import { db } from '@/lib/firebase'; // Client-seitige Firestore-Instanz (funktioniert auch im Node.js Build-Kontext)
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';

// Importiere die neue Client-Komponente
import BlogPostDetailClient from '@/components/BlogPostDetailClient';

// Importiere die PageProps von Next.js
import { Metadata, ResolvingMetadata } from 'next'; // Für generateMetadata, falls benötigt
// Definiere einen eigenen Params-Typ für die Route-Parameter
type Params = { [key: string]: string };

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
  // Hole alle Dokumente aus der 'blogPosts'-Sammlung
  const querySnapshot = await getDocs(collection(db, 'blogPosts'));
  
  // Erstelle ein Array von Parametern für jede Blogpost-ID
  const params = querySnapshot.docs.map(doc => ({
    id: doc.id,
  }));

  return params;
}

// Die Page-Komponente ist jetzt eine Server-Komponente
// Verwende hier direkt den erwarteten Typ für die Props
// Der Typ 'Params' kommt von 'next/dist/shared/lib/router/utils/route-matcher'
// Dies ist ein Workaround, um den Typfehler zu umgehen, da PageProps nicht direkt exportiert werden.
export default async function BlogPostDetailPage({ params }: { params: Params & { id: string } }) { // Typ direkt im Argument definiert
  const { id } = params; // Hole die Blogpost-ID aus den URL-Parametern (Server-seitig)

  let blogPost: BlogPost | null = null;
  let error: string = '';
  let loading: boolean = true;

  try {
    // Hole das spezifische Blogpost-Dokument aus Firestore
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
    loading = false; // Setze loading auf false, da der Fetch abgeschlossen ist
  }

  // Rendere die Client-Komponente und übergebe die Daten als Props
  return (
    <BlogPostDetailClient blogPost={blogPost} loading={loading} error={error} />
  );
}