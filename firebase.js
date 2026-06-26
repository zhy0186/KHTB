import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB3jEGxVxty9N8gAQyXh4ozyWbMqhXaOMA",
  authDomain: "khtb-d09ad.firebaseapp.com",
  projectId: "khtb-d09ad",
  storageBucket: "khtb-d09ad.firebasestorage.app",
  messagingSenderId: "543151767116",
  appId: "1:543151767116:web:3c8e5ed1a2929ad3877ee9"
};

const app =
  initializeApp(firebaseConfig);

const db =
  getFirestore(app);

export { db };
