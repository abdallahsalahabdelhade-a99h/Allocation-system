import AuthProvider from '@/components/AuthProvider';
import './globals.css';

export const metadata = {
  title: 'Allocation Admin Dashboard',
  description: 'Smart Student Allocation System Administration',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
