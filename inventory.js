import { db } from "./firebase.js";

import {
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

export async function takeItem(docId, currentStock, qty) {

    await updateDoc(
        doc(db, "inventory", docId),
        {
            stock: currentStock - qty
        }
    );

}
