console.log("admin.js loaded");

// ======================
// KH TAOBAO Admin Login
// ======================

const ADMIN_PASSWORD = "123456";

const adminBtn = document.getElementById("adminBtn");
const addItemBtn = document.getElementById("addItemBtn");

const loginModal = document.getElementById("loginModal");
const loginBtn = document.getElementById("loginBtn");
const cancelBtn = document.getElementById("cancelBtn");
const passwordInput = document.getElementById("password");

// ======================
// 更新 UI
// ======================

function updateAdminUI() {

    const isAdmin = localStorage.getItem("isAdmin") === "true";

    if (isAdmin) {
        adminBtn.textContent = "Logout";

        if (addItemBtn) {
            addItemBtn.style.display = "inline-block";
        }

    } else {

        adminBtn.textContent = "Login";

        if (addItemBtn) {
            addItemBtn.style.display = "none";
        }

    }

}

updateAdminUI();

// ======================
// Login / Logout
// ======================

adminBtn.addEventListener("click", () => {

    console.log("Login button clicked");

    const isAdmin = localStorage.getItem("isAdmin") === "true";

    // Logout
    if (isAdmin) {

        if (confirm("Logout Admin?")) {

            localStorage.removeItem("isAdmin");
            updateAdminUI();
            location.reload();

        }

        return;

    }

    // Show Login Modal
    loginModal.style.display = "flex";
    passwordInput.value = "";
    passwordInput.focus();

});

// ======================
// Login
// ======================

loginBtn.addEventListener("click", () => {

    const password = passwordInput.value.trim();

    if (password === ADMIN_PASSWORD) {

        localStorage.setItem("isAdmin", "true");

        loginModal.style.display = "none";

        updateAdminUI();

        location.reload();

    } else {

        alert("Wrong Password");

        passwordInput.value = "";
        passwordInput.focus();

    }

});

// ======================
// Cancel
// ======================

cancelBtn.addEventListener("click", () => {

    loginModal.style.display = "none";

});

// ======================
// Enter Login
// ======================

passwordInput.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {
        loginBtn.click();
    }

});