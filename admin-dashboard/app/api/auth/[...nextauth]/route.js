import NextAuth from 'next-auth';
const { authOptions } = require('@/lib/auth');

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
