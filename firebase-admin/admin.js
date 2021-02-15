const admin = require('firebase-admin');
const serviceAccount = require('../noticebee-tests-firebase.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;