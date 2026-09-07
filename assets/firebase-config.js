/*
  RashiVibe OTP setup
  Fill this object from Firebase Console > Project settings > Your apps > Web app.
  Then enable Authentication > Sign-in method > Phone and add the GitHub/custom domains under Authorized domains.
  Firebase web config is a client configuration; OTP security is enforced by Firebase Auth + reCAPTCHA.
*/
window.RV_FIREBASE_CONFIG = window.RV_FIREBASE_CONFIG || {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};
