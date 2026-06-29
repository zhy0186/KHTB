import { db } from "./firebase.js";

let editingId = null;

import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const inventoryContainer =
  document.getElementById("inventoryContainer");

const isAdmin =
  localStorage.getItem("isAdmin") === "true";

// ======================
// Load Inventory
// ======================

async function loadInventory() {

  inventoryContainer.innerHTML = "<p>Loading...</p>";

  try {

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
          ? `<div class="low-stock">⚠ Low Stock</div>`
          : ""
        }

        <div class="action-row">

    <button class="take-btn">
        Take
    </button>

    ${isAdmin ? `
        <button class="add-btn">
            + Stock
        </button>
    ` : ""}

</div>

${isAdmin ? `

<div class="action-row">

    <button class="edit-btn">
        ✏ Edit
    </button>

    <button class="delete-btn">
        🗑 Delete
    </button>

</div>

` : ""
}
      `;

      // ======================
      // Take
      // ======================

      const takeBtn =
        card.querySelector(".take-btn");

      takeBtn.addEventListener("click", async () => {

        if (item.stock <= 0) {

          alert("Out of Stock");
          return;

        }

        const qty = parseInt(

          prompt(
            `Current Stock : ${item.stock}\n\nTake Quantity`
          )

        );

        if (isNaN(qty) || qty <= 0) {
          return;
        }

        if (qty > item.stock) {

          alert("Not enough stock.");
          return;

        }

        await updateDoc(

          doc(db, "inventory", docSnap.id),

          {
            stock: item.stock - qty
          }

        );

        loadInventory();

      });

      // ======================
      // + Stock
      // ======================

      if (isAdmin) {

        const addBtn =
          card.querySelector(".add-btn");

        addBtn.addEventListener("click", async () => {

          
          const qty = parseInt(

            prompt(
              `Current Stock : ${item.stock}\n\nAdd Stock Quantity`
            )

          );

          if (isNaN(qty) || qty <= 0) {
            return;
          }

          await updateDoc(

            doc(db, "inventory", docSnap.id),

            {
              stock: item.stock + qty
            }

          );

          loadInventory();

        });
        

        // ======================
        // Edit
        // ======================

        const editBtn = card.querySelector(".edit-btn");

        editBtn.addEventListener("click", () => {

            editingId = docSnap.id;

            nameCN.value = item.name_cn;
            nameEN.value = item.name_en;
            stockInput.value = item.stock;

            document.querySelector("#addItemModal h2").textContent = "Edit Item";
            saveItemBtn.textContent = "Update";

            addItemModal.style.display = "flex";

        });

      // ======================
      // Delete
      // ======================

const deleteBtn = card.querySelector(".delete-btn");

deleteBtn.addEventListener("click", async () => {

    const confirmDelete = confirm(
        `Delete "${item.name_en}" ?`
    );

    if (!confirmDelete) return;

    await deleteDoc(
        doc(db, "inventory", docSnap.id)
    );

    loadInventory();

});

}

      inventoryContainer.appendChild(card);

    


    });

  } catch (error) {

    console.error(error);

    inventoryContainer.innerHTML =
      "<p>Error Loading Inventory</p>";

  }

}

loadInventory();
// ======================
// Add Item
// ======================

const addItemBtn = document.getElementById("addItemBtn");

const addItemModal = document.getElementById("addItemModal");

const saveItemBtn = document.getElementById("saveItemBtn");

const cancelItemBtn = document.getElementById("cancelItemBtn");

const nameCN = document.getElementById("nameCN");

const nameEN = document.getElementById("nameEN");

const stockInput = document.getElementById("stock");

// 打开新增窗口
if (addItemBtn) {

    addItemBtn.addEventListener("click", () => {

        addItemModal.style.display = "flex";

        nameCN.value = "";
        nameEN.value = "";
        stockInput.value = "";

    });

}

// 取消
cancelItemBtn.addEventListener("click", () => {

    addItemModal.style.display = "none";

});

// 保存
saveItemBtn.addEventListener("click", async () => {

    const cn = nameCN.value.trim();

    const en = nameEN.value.trim();

    const stock = parseInt(stockInput.value);

    if (!cn || !en || isNaN(stock) || stock < 0) {

        alert("Please complete all fields.");

        return;

    }

    if (editingId) {

    await updateDoc(
        doc(db, "inventory", editingId),
        {
            name_cn: cn,
            name_en: en,
            stock: stock,
            updatedAt: new Date().toLocaleString()
        }
    );

    editingId = null;

} else {

    await addDoc(
        collection(db, "inventory"),
        {
            name_cn: cn,
            name_en: en,
            stock: stock,
            updatedAt: new Date().toLocaleString()
        }
    );

}

addItemModal.style.display = "none";

nameCN.value = "";
nameEN.value = "";
stockInput.value = "";

loadInventory();

});
