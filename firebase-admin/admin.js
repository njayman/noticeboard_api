const admin = require("firebase-admin");
const serviceAccount = require("../noticebee-tests-firebase.json");
const {
  FIREBASE_ACCOUNT_TYPE,
  FIREBASE_PROJECT_ID,
  FIREBASE_PRIVATE_KEY_ID,
  //   FIREBASE_PRIVATE_KEY,
  FIREBASE_CLIENT_EMAIL,
  FIREBASE_CLIENT_ID,
  FIREBASE_AUTH_URI,
  FIREBASE_TOKEN_URI,
  AUTH_PROVIDER_X509_CERT_URL,
  CLIENT_X509_CERT_URL,
} = process.env;
// admin.initializeApp({
//   credential: admin.credential.cert({
//     type: FIREBASE_ACCOUNT_TYPE,
//     project_id: FIREBASE_PROJECT_ID,
//     private_key_id: FIREBASE_PRIVATE_KEY_ID,
//     private_key: serviceAccount.private_key,
//     client_email: FIREBASE_CLIENT_EMAIL,
//     client_id: FIREBASE_CLIENT_ID,
//     auth_uri: FIREBASE_AUTH_URI,
//     token_uri: FIREBASE_TOKEN_URI,
//     auth_provider_x509_cert_url: AUTH_PROVIDER_X509_CERT_URL,
//     client_x509_cert_url: CLIENT_X509_CERT_URL,
//   }),
// });
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
