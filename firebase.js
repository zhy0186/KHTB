// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyB3jEGxVxty9N8gAQyXh4ozyWbMqhXaOMA",
  authDomain: "khtb-d09ad.firebaseapp.com",
  projectId: "khtb-d09ad",
  storageBucket: "khtb-d09ad.firebasestorage.app",
  messagingSenderId: "543151767116",
  appId: "1:543151767116:web:3c8e5ed1a2929ad3877ee9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore Database
const db = getFirestore(app);

// Export
export { db };
.take-btn {
    background: #0F4C81;
    color: white;
    border: none;
    padding: 10px 16px;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 10px;
}

.take-btn:hover {
    opacity: 0.9;
}
