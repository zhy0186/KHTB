import { db } from "./firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const inventoryContainer =
  document.getElementById("inventoryContainer");

// 读取库存
async function loadInventory() {

  inventoryContainer.innerHTML =
    "<p>Loading...</p>";

  const querySnapshot =
    await getDocs(collection(db, "inventory"));

  inventoryContainer.innerHTML = "";

  querySnapshot.forEach((doc) => {

    const item = doc.data();

    const card = document.createElement("div");

    card.className = "inventory-card";

    card.innerHTML = `
      <h3>${item.name_en}</h3>
      <p>${item.name_cn}</p>

      <div class="stock">
        ${item.stock} pcs
      </div>

      ${
        item.stock < 10
        ? '<div class="low-stock">⚠ Low Stock</div>'
        : ''
      }
    `;

    inventoryContainer.appendChild(card);

  });

}

loadInventory();
