const bcrypt = require('bcryptjs');
const CredentialsProvider = require('next-auth/providers/credentials').default;
const GoogleProvider = require('next-auth/providers/google').default;
const { findUserByEmail, createUser, updateLastLogin } = require('./db');

/** @type {import('next-auth').AuthOptions} */
const authOptions = {
  secret: process.env.AUTH_SECRET,
  
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  providers: [
    // 1. Email & Password login
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter your email and password.');
        }

        const user = findUserByEmail(credentials.email);
        if (!user) {
          throw new Error('No account found with this email.');
        }

        if (!user.password_hash) {
          throw new Error('This account uses Google Sign-In. Please use the Google button.');
        }

        const valid = await bcrypt.compare(credentials.password, user.password_hash);
        if (!valid) {
          throw new Error('Invalid password. Please try again.');
        }

        updateLastLogin(user.id);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.avatar_url,
        };
      },
    }),

    // 2. Google OAuth SSO (only if configured)
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],

  callbacks: {
    // Handle Google SSO user creation/linking
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        let dbUser = findUserByEmail(user.email);
        if (!dbUser) {
          // Auto-create new Google users as 'viewer'
          dbUser = createUser({
            email: user.email,
            name: user.name || user.email.split('@')[0],
            passwordHash: null,
            role: 'viewer',
            authProvider: 'google',
            avatarUrl: user.image,
          });
        }
        updateLastLogin(dbUser.id);
        user.id = dbUser.id;
        user.role = dbUser.role;
      }
      return true;
    },

    // Inject role into JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },

    // Expose role in client-side session
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};

module.exports = { authOptions };
