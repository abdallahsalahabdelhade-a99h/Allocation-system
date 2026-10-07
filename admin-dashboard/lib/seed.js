/**
 * Seed script — creates the default admin user.
 * Run with: npm run seed
 */
const bcrypt = require('bcryptjs');
const { findUserByEmail, createUser, getDb } = require('./db');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@allocation.local';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@2026!';

async function seed() {
  console.log('🔧 Initializing database...');
  
  // Ensure DB is initialized (tables created)
  getDb();

  const existing = findUserByEmail(ADMIN_EMAIL);
  if (existing) {
    console.log(`⚠️  Admin user "${ADMIN_EMAIL}" already exists (role: ${existing.role}). Skipping.`);
    return;
  }

  const hash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  const user = createUser({
    email: ADMIN_EMAIL,
    name: 'System Admin',
    passwordHash: hash,
    role: 'admin',
    authProvider: 'credentials',
  });

  console.log(`✅ Admin user created:`);
  console.log(`   Email:    ${user.email}`);
  console.log(`   Role:     ${user.role}`);
  console.log(`   Password: ${ADMIN_PASSWORD}`);
  console.log('');
  console.log('⚠️  Change this password in production!');
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
