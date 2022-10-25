const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./serviceAccountKey.js');


const app = initializeApp({
    credential: cert(serviceAccount)
});

module.exports = {
    db: getFirestore(app)
}