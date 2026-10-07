/**
 * Role-checking utilities for API route protection.
 */
const { getServerSession } = require('next-auth');
const { authOptions } = require('./auth');

/**
 * Get the current authenticated session in an API route.
 * Returns null if not authenticated.
 */
async function getSession(req, res) {
  return await getServerSession(req, res, authOptions);
}

/**
 * Middleware wrapper for API routes.
 * Verifies authentication and optionally checks role.
 * 
 * Usage:
 *   export default withAuth(handler)                    // any authenticated user
 *   export default withAuth(handler, { role: 'admin' }) // admin only
 */
function withAuth(handler, options = {}) {
  return async (req, res) => {
    const session = await getSession(req, res);

    if (!session || !session.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'You must be logged in to access this resource.',
      });
    }

    if (options.role && session.user.role !== options.role) {
      return res.status(403).json({
        error: 'Forbidden',
        message: `This action requires the "${options.role}" role. Your role is "${session.user.role}".`,
      });
    }

    // Attach session to request for downstream use
    req.session = session;
    return handler(req, res);
  };
}

/**
 * Check if a user has a specific role.
 * Useful in Server Components.
 */
function hasRole(session, role) {
  return session?.user?.role === role;
}

/**
 * Check if user is admin.
 */
function isAdmin(session) {
  return hasRole(session, 'admin');
}

module.exports = { getSession, withAuth, hasRole, isAdmin };
