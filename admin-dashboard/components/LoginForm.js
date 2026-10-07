'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './LoginForm.module.css';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl,
      });

      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    signIn('google', { callbackUrl });
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Sign in to the Allocation Admin Dashboard</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
              placeholder="admin@allocation.local"
              disabled={loading}
            />
          </div>
          
          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className={styles.divider}>
          <span>OR</span>
        </div>

        <button 
          type="button" 
          onClick={handleGoogleLogin} 
          className={styles.googleButton}
          disabled={loading}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
}
