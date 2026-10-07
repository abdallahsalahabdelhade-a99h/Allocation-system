'use client';

import { SessionProvider } from 'next-auth/react';

/**
 * Wraps the app with NextAuth SessionProvider.
 * This makes useSession() available in all client components.
 */
export default function AuthProvider({ children }) {
  return (
    <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus={true}>
      {children}
    </SessionProvider>
  );
}
