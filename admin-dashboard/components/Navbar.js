'use client';

import { useSession, signOut } from 'next-auth/react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  const initials = (session.user.name || session.user.email)
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className={styles.navbar}>
      <div className={styles.brand}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
        <span className={styles.title}>Allocation Admin</span>
      </div>

      <nav className={styles.nav}>
        <a href="/dashboard" className={styles.link}>Dashboard</a>
        <a href="/dashboard/allocation" className={styles.link}>Allocation</a>
      </nav>

      <div className={styles.user}>
        <div className={styles.info}>
          <span className={styles.name}>{session.user.name || session.user.email}</span>
          <span className={styles.role}>{session.user.role}</span>
        </div>
        {session.user.image ? (
          <img src={session.user.image} alt="" className={styles.avatar} />
        ) : (
          <div className={styles.avatarFallback}>{initials}</div>
        )}
        <button onClick={() => signOut({ callbackUrl: '/login' })} className={styles.logout}>
          Sign out
        </button>
      </div>
    </header>
  );
}
