'use client';

import { useSession } from 'next-auth/react';

/**
 * Conditional renderer based on user role.
 * 
 * Usage:
 *   <RoleGate role="admin">
 *     <DangerousButton />
 *   </RoleGate>
 * 
 *   <RoleGate role="admin" fallback={<p>Admin only</p>}>
 *     <AdminPanel />
 *   </RoleGate>
 */
export default function RoleGate({ role, children, fallback = null }) {
  const { data: session } = useSession();

  if (!session?.user) return fallback;
  if (session.user.role !== role) return fallback;

  return children;
}
