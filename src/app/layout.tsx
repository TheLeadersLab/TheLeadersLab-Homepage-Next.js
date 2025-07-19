// src/app/layout.tsx
import './globals.css'; // Your global CSS imports
import { Inter } from 'next/font/google'; // Example for a font import
import { AuthProvider } from '@/context/AuthContext'; // Import the AuthProvider - Pfad angepasst

const inter = Inter({ subsets: ['latin'] }); // Example for font initialization

export const metadata = {
  title: 'TheLeaders_Lab Homepage', // Your page title
  description: 'Persönliches Portfolio und Wissenshub von TheLeaders_Lab.', // Your page description
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className={inter.className}>
        {/* Wrap your entire application with the AuthProvider */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
