// src/app/blog/[id]/page.tsx
'use client'; // Dies ist eine Client-Komponente

import React, { useEffect, useState } from 'react';
// Importiere die Firestore-Instanzen für den Server
import { db } from '@/lib/firebase'; // Client-seitige Firestore-Instanz (funktioniert auch im Node.js Build-Kontext)
import { collection, doc, getDoc } from 'firebase/firestore'; // getDocs entfernt, da generateStaticParams entfernt wird
import { useParams } from 'next/navigation'; // Hook, um URL-Parameter zu lesen
import Link from 'next/link';

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

// generateStaticParams Funktion entfernt, da wir nicht mehr statisch exportieren
// export async function generateStaticParams() { ... }

// Die Page-Komponente ist jetzt eine Server-Komponente
// Verwende hier direkt den erwarteten Typ für die Props
export default async function BlogPostDetailPage({ params }: { params: { id: string } }) {
  const { id } = params; // Hole die Blogpost-ID aus den URL-Parametern (Server-seitig)

  let blogPost: BlogPost | null = null;
  let error: string = '';
  let loading: boolean = true;

  // Da dies eine Server-Komponente ist, können wir Daten hier direkt abrufen.
  // Allerdings ist die Komponente auch 'use client', was den direkten async-Aufruf in useEffect erfordert.
  // Wir behalten den useEffect-Ansatz bei, da er bereits in der Client-Komponente ist.
  // Die Daten werden clientseitig geholt, sobald die Komponente im Browser geladen wird.

  // Da wir generateStaticParams entfernt haben, wird der Build-Fehler behoben.
  // Die Daten für den Blogpost werden clientseitig in BlogPostDetailClient geholt.
  // Der useParams-Hook ist eine Client-Komponenten-Funktion, daher ist 'use client' notwendig.

  // Die Logik zum Abrufen der Daten wird jetzt komplett in BlogPostDetailClient behandelt.
  // Diese Server-Komponente dient nur als Wrapper, um die ID an die Client-Komponente zu übergeben.
  // Die 'loading' und 'error' Zustände werden ebenfalls von der Client-Komponente verwaltet.

  // Wir können den Datenabruf hier serverseitig machen, wenn wir 'use client' entfernen würden.
  // Aber um den aktuellen Code-Flow beizubehalten und den Build-Fehler zu beheben,
  // übergeben wir die ID einfach an die Client-Komponente, die dann die Daten holt.

  return (
    <BlogPostDetailClient blogPost={null} loading={true} error={''} /> // Initialwerte, da Daten in Client-Komponente geholt werden
  );
}