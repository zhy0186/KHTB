import { db } from "./firebase.js";

import {
    addActivity,
    loadActivity
} from "./activity.js";

import {
    takeItem
} from "./inventory.js";

import {
    collection,
    getDocs,
    doc,
    updateDoc,
    addDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

let editingId = null;

const inventoryContainer =
  document.getElementById("inventoryContainer");

  const activityContainer =
  document.getElementById("activityContainer");

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

        await takeItem(
    docSnap.id,
    item.stock,
    qty
);

await addActivity(
    "Take",
    item.name_en,
    qty
);

loadInventory();
loadActivity(activityContainer);


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

          const newStock = item.stock + qty;

if (newStock > 999) {

    alert("Maximum stock is 999.");

    return;

}

await updateDoc(

    doc(db, "inventory", docSnap.id),

    {
        stock: newStock
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
loadActivity(activityContainer);
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

    if (stock > 999) {

    alert("Maximum stock is 999.");

    return;

}

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
loadInventory();
// ======================
// Export Buttons  EXCEL & PDF
// ======================

const exportExcelBtn = document.getElementById("exportExcelBtn");
const exportPdfBtn = document.getElementById("exportPdfBtn");

exportExcelBtn.addEventListener("click", async () => {

    const snapshot = await getDocs(collection(db, "inventory"));

    const data = [];

    let index = 1;

    snapshot.forEach((doc) => {

        const item = doc.data();
data.push({

    No: index++,

    Item: item.name_en,

    " ": item.name_cn,

    Stock: item.stock

});

    });

    const worksheet =
    XLSX.utils.json_to_sheet(data);

// 设置列宽
worksheet["!cols"] = [
    { wch: 8 },   // No.
    { wch: 35 },  // Item
    { wch: 30 },  // 中文
    { wch: 10 }   // Stock
];

const workbook =
    XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");

    const today = new Date();

const fileDate =
`${String(today.getDate()).padStart(2, "0")}-${String(today.getMonth() + 1).padStart(2, "0")}-${today.getFullYear()}`;

XLSX.writeFile(
    workbook,
    `KH_TAOBAO_库存剩余EXCEL_${fileDate}.xlsx`
);

});

////// PDF ///////
exportPdfBtn.addEventListener("click", async () => {

    const snapshot = await getDocs(collection(db, "inventory"));

    const rows = [];

let index = 1;

let totalStock = 0;

let lowStock = 0;

   snapshot.forEach((docSnap) => {

    const item = docSnap.data();

    // ===== Statistics =====
    totalStock += item.stock;

    if (item.stock < 10) {
        lowStock++;
    }

    rows.push([
        index++,
        item.name_en,
        item.stock
    ]);

});

    const { jsPDF } = window.jspdf;

    const logo = new Image();
    logo.src = "logo.png";

    logo.onload = () => {

        const pdf = new jsPDF();

        // ===== Logo =====
        pdf.addImage(logo, "PNG", 14, 10, 18, 18);

        // ===== Title =====
        pdf.setFontSize(18);
        pdf.text("KH TAOBAO", 38, 18);

        pdf.setFontSize(11);
        pdf.text("Inventory Stock Report", 38, 26);

        // ===== Date =====
        const now = new Date();

        const reportDate =
            `${String(now.getDate()).padStart(2, "0")}-${String(now.getMonth() + 1).padStart(2, "0")}-${now.getFullYear()} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

        pdf.setFontSize(10);
        pdf.text(`Generated: ${reportDate}`, 38, 33);

        pdf.setFontSize(11);

pdf.text(`Total Items : ${rows.length}`, 14, 42);

pdf.text(`Total Stock : ${totalStock} pcs`, 14, 49);

pdf.setTextColor(220,53,69);

pdf.text(`Low Stock : ${lowStock} Items`,14,56);

pdf.setTextColor(0,0,0);


        // ===== Table =====
       pdf.autoTable({

    startY: 64,

    head: [["No.", "Item", "Stock"]],

    body: rows,

    theme: "grid",

    headStyles: {
        halign: "center"
    },

    bodyStyles: {
        halign: "center"
    },

    columnStyles: {

        1: {
            halign: "left"
        }

    },

    didParseCell: function (data) {

    // 只处理表格内容
    if (data.section === "body") {

        const stock = Number(data.row.raw[2]);

        if (stock < 10) {

            // 整行变红
            data.cell.styles.textColor = [200, 0, 0];

        } else {

            // 整行黑色
            data.cell.styles.textColor = [0, 0, 0];

        }

    }

}

});

        // ===== Footer =====
        const pageHeight = pdf.internal.pageSize.height;

        pdf.setFontSize(9);

        pdf.text(
            "Generated by KHTB Inventory System",
            14,
            pageHeight - 10
        );

        pdf.text(
            `Page 1 / ${pdf.getNumberOfPages()}`,
            170,
            pageHeight - 10
        );

        // ===== Save =====
        const fileDate =
            `${String(now.getDate()).padStart(2, "0")}-${String(now.getMonth() + 1).padStart(2, "0")}-${now.getFullYear()}`;

        pdf.save(`KH_TAOBAO_库存剩余PDF_${fileDate}.pdf`);

    };

});