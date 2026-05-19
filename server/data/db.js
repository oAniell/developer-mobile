const { db } = require('../firebase');

// ─── Users ───────────────────────────────────────────────

async function getUsers() {
  const snapshot = await db.collection('users').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function createUser(data) {
  const docRef = await db.collection('users').add(data);
  return { id: docRef.id, ...data };
}

async function updateUser(id, data) {
  const ref = db.collection('users').doc(id);
  const doc = await ref.get();
  if (!doc.exists) return null;
  await ref.update(data);
  return { id, ...doc.data(), ...data };
}

async function deleteUser(id) {
  const ref = db.collection('users').doc(id);
  const doc = await ref.get();
  if (!doc.exists) return false;
  await ref.delete();
  return true;
}

// ─── Products ────────────────────────────────────────────

async function getProducts() {
  const snapshot = await db.collection('products').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function createProduct(data) {
  const docRef = await db.collection('products').add(data);
  return { id: docRef.id, ...data };
}

async function updateProduct(id, data) {
  const ref = db.collection('products').doc(id);
  const doc = await ref.get();
  if (!doc.exists) return null;
  await ref.update(data);
  return { id, ...doc.data(), ...data };
}

async function deleteProduct(id) {
  const ref = db.collection('products').doc(id);
  const doc = await ref.get();
  if (!doc.exists) return false;
  await ref.delete();
  return true;
}

async function getProductById(id) {
  const ref = db.collection('products').doc(id);
  const doc = await ref.get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

module.exports = { getUsers, createUser, updateUser, deleteUser, getProducts, createProduct, updateProduct, deleteProduct, getProductById };
