import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  doc,
  updateDoc
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

  querySnapshot.forEach((docSnap) => {

    const item = docSnap.data();

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

      <button class="take-btn">
        -1
      </button>
    `;

    const takeBtn =
      card.querySelector(".take-btn");

    takeBtn.addEventListener("click", async () => {

      if (item.stock <= 0) {
        alert("Out of Stock");
        return;
      }

      await updateDoc(
        doc(db, "inventory", docSnap.id),
        {
          stock: item.stock - 1
        }
      );

      loadInventory();

    });

    inventoryContainer.appendChild(card);

  });

}

loadInventory();
