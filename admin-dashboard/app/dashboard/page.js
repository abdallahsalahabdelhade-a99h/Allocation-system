import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import styles from './dashboard.module.css';

export const metadata = {
  title: 'Dashboard | Allocation Admin',
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Welcome, {session?.user?.name || 'User'}</h1>
        <p className={styles.subtitle}>Overview of the Smart Student Allocation System</p>
      </header>

      <div className={styles.grid}>
        <a href="/dashboard/allocation" className={styles.card}>
          <div className={styles.cardIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="3" y1="9" x2="21" y2="9"/>
              <line x1="9" y1="21" x2="9" y2="9"/>
            </svg>
          </div>
          <h2 className={styles.cardTitle}>Allocation Engine</h2>
          <p className={styles.cardText}>Run the AI allocation process, map levels, and manage waitlists.</p>
        </a>

        {session?.user?.role === 'admin' && (
          <div className={styles.card}>
            <div className={styles.cardIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h2 className={styles.cardTitle}>User Management</h2>
            <p className={styles.cardText}>Manage admin and viewer access (Coming soon).</p>
          </div>
        )}
      </div>
    </div>
  );
}
