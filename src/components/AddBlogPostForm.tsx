// src/components/AddBlogPostForm.tsx
'use client'; // Dies ist ein Client Component

import React, { useState } from 'react';
import { db } from '@/lib/firebase'; // Importiere die Firestore-Instanz
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext'; // Importiere den Auth-Context
// import { useRouter } from 'next/navigation'; // Entfernt, da nicht verwendet

const AddBlogPostForm: React.FC = () => {
  const { currentUser, login, logout, loading: authLoading } = useAuth(); // Hole den aktuellen Benutzer und Auth-Funktionen
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [tags, setTags] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // const router = useRouter(); // Entfernt, da nicht verwendet

  // Funktion zum Hinzufügen eines neuen Blogposts
  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError('Sie müssen angemeldet sein, um einen Blogpost hinzuzufügen.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Füge den Blogpost zur 'blogPosts'-Sammlung in Firestore hinzu
      await addDoc(collection(db, 'blogPosts'), {
        title,
        content,
        youtubeLink,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0), // Tags als Array speichern
        authorId: currentUser.uid, // Speichere die ID des Autors
        authorEmail: currentUser.email, // Speichere die E-Mail des Autors
        createdAt: serverTimestamp(), // Firestore-Timestamp für die Erstellungszeit
      });

      setSuccess('Blogpost erfolgreich hinzugefügt!');
      setTitle('');
      setContent('');
      setYoutubeLink('');
      setTags('');

      // Optional: Trigger Netlify rebuild (fortgeschritten, hier nur als Kommentar)
      // Für einen automatischen Rebuild nach jedem Post müsste ein Netlify Build Hook
      // über eine Firebase Cloud Function ausgelöst werden. Das ist komplexer.
      // Für jetzt kann man den Deploy manuell triggern oder nach einer Weile warten.
      // Oder man kann hier einen einfachen Fetch-Aufruf zu einem Build Hook machen,
      // aber das würde den Build Hook im Frontend exponieren, was nicht ideal ist.
      // const netlifyBuildHook = 'YOUR_NETLIFY_BUILD_HOOK_URL'; // ERSETZE DIES!
      // await fetch(netlifyBuildHook, { method: 'POST' });
      // console.log('Netlify Build Hook ausgelöst!');

      // Optional: Seite neu laden oder zu einer anderen Seite navigieren, um Änderungen zu sehen
      // router.refresh(); // Nur für Next.js App Router, um Daten neu zu laden
      // router.push('/themen'); // Oder navigiere zur Themen-Seite
      
    } catch (err: unknown) { // Typ von 'any' zu 'unknown' geändert
      console.error('Fehler beim Hinzufügen des Blogposts:', err);
      if (err instanceof Error) { // Fehlerbehandlung für 'unknown'
        setError('Fehler beim Hinzufügen des Blogposts: ' + err.message);
      } else {
        setError('Ein unbekannter Fehler ist aufgetreten.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Funktion zum Einloggen
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      setSuccess('Erfolgreich eingeloggt!');
    } catch (err: unknown) { // Typ von 'any' zu 'unknown' geändert
      if (err instanceof Error) { // Fehlerbehandlung für 'unknown'
        setError('Fehler beim Einloggen: ' + err.message);
      } else {
        setError('Ein unbekannter Fehler ist aufgetreten.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Wenn der Authentifizierungsstatus noch geladen wird
  if (authLoading) {
    return <div className="text-center py-8 text-gray-700">Lade Authentifizierungsstatus...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg my-8">
      <h2 className="text-3xl font-bold text-[#262b5e] mb-6 text-center">Blogpost hinzufügen</h2>

      {!currentUser ? (
        // Login-Formular, wenn nicht eingeloggt
        <form onSubmit={handleLogin} className="space-y-4">
          <p className="text-gray-700 text-center mb-4">Bitte melden Sie sich an, um einen Blogpost hinzuzufügen.</p>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Passwort</label>
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
            {loading ? 'Melde an...' : 'Anmelden'}
          </button>
          {error && <p className="text-red-600 text-sm mt-2 text-center">{error}</p>}
        </form>
      ) : (
        // Blogpost-Formular, wenn eingeloggt
        <form onSubmit={handleAddPost} className="space-y-4">
          <p className="text-gray-700 text-center mb-4">Angemeldet als: <span className="font-semibold text-[#262b5e]">{currentUser.email}</span></p>
          <button
            onClick={logout}
            className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition duration-150 ease-in-out font-semibold mb-4"
            disabled={loading}
          >
            Abmelden
          </button>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Titel des Blogposts</label>
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
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Inhalt</label>
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
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">Tags (kommagetrennt, z.B. Führung, Kommunikation)</label>
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
            {loading ? 'Sende...' : 'Blogpost hinzufügen'}
          </button>
          {error && <p className="text-red-600 text-sm mt-2 text-center">{error}</p>}
          {success && <p className="text-green-600 text-sm mt-2 text-center">{success}</p>}
        </form>
      )}
    </div>
  );
};

export default AddBlogPostForm;