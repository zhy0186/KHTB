import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    addDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

export async function addActivity(action, item, qty) {

    await addDoc(
        collection(db, "activity"),
        {
            action,
            item,
            qty,
            time: new Date().toLocaleString()
        }
    );

}

export async function loadActivity(activityContainer) {

    const querySnapshot =
        await getDocs(collection(db, "activity"));

    activityContainer.innerHTML = "";

    querySnapshot.forEach((docSnap) => {

        const data = docSnap.data();

        activityContainer.innerHTML += `

        <div class="activity-card">

            <strong>${data.action}</strong><br>

            ${data.item}<br>

            Qty : ${data.qty}<br>

            <small>${data.time}</small>

        </div>

        `;

    });

}