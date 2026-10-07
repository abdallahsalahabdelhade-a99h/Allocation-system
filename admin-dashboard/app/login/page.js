import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import LoginForm from '@/components/LoginForm';

export const metadata = {
  title: 'Sign In | Allocation Admin',
};

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  // If already logged in, redirect to dashboard
  if (session) {
    redirect('/dashboard');
  }

  return <LoginForm />;
}
