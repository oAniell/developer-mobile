const admin = require('firebase-admin');

const credential = process.env.FIREBASE_SERVICE_ACCOUNT
  ? admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
  : admin.credential.cert(require('./serviceAccountKey.json'));

admin.initializeApp({ credential });

const db = admin.firestore();

module.exports = { db };
