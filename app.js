function showToast(message, color = "#3b82f6") {
  const toast = document.getElementById("toast");
  toast.style.display = "block";
  toast.style.background = color;
  toast.innerText = message;
  setTimeout(() => toast.style.display = "none", 3000);
}

if (document.getElementById("registerForm")) {
  document.getElementById("registerForm").addEventListener("submit", e => {
    e.preventDefault();
    showToast("Akun berhasil dibuat!", "#10b981");
  });
}

if (document.getElementById("loginForm")) {
  document.getElementById("loginForm").addEventListener("submit", e => {
    e.preventDefault();
    showToast("Login berhasil! Selamat datang Night!", "#3b82f6");
  });
}

if (document.getElementById("forgotForm")) {
  document.getElementById("forgotForm").addEventListener("submit", e => {
    e.preventDefault();
    showToast("Link reset telah dikirim ke email kamu!", "#f59e0b");
  });
}
