const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DB_PATH = path.join(__dirname, '..', 'data', 'users.json');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

function getDb() {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ users: [] }, null, 2));
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function saveDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function generateId() {
  return crypto.randomBytes(16).toString('hex');
}

function findUserByEmail(email) {
  const db = getDb();
  return db.users.find(u => u.email === email.toLowerCase().trim()) || null;
}

function findUserById(id) {
  const db = getDb();
  return db.users.find(u => u.id === id) || null;
}

function createUser({ email, name, passwordHash, role = 'viewer', authProvider = 'credentials', avatarUrl = null }) {
  const db = getDb();
  const id = generateId();
  
  const newUser = {
    id,
    email: email.toLowerCase().trim(),
    name,
    password_hash: passwordHash,
    role,
    auth_provider: authProvider,
    avatar_url: avatarUrl,
    created_at: new Date().toISOString(),
    last_login: null
  };
  
  db.users.push(newUser);
  saveDb(db);
  
  return newUser;
}

function updateLastLogin(id) {
  const db = getDb();
  const user = db.users.find(u => u.id === id);
  if (user) {
    user.last_login = new Date().toISOString();
    saveDb(db);
  }
}

function getAllUsers() {
  const db = getDb();
  return db.users.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

function updateUserRole(id, role) {
  const db = getDb();
  const user = db.users.find(u => u.id === id);
  if (user) {
    user.role = role;
    saveDb(db);
  }
}

function deleteUser(id) {
  const db = getDb();
  db.users = db.users.filter(u => u.id !== id);
  saveDb(db);
}

module.exports = {
  getDb,
  generateId,
  findUserByEmail,
  findUserById,
  createUser,
  updateLastLogin,
  getAllUsers,
  updateUserRole,
  deleteUser,
};
