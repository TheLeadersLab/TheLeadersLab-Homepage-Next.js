    import type { NextConfig } from 'next';

    const nextConfig: NextConfig = {
      output: 'export', // <-- Diese Zeile ist entscheidend für statischen Export
      // ... andere bestehende Einstellungen hier
    };

    export default nextConfig;