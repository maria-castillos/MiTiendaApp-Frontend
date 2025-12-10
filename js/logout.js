document.addEventListener("DOMContentLoaded", () => {

  const logoutBtn = document.getElementById("logoutBtn");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", () => {

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user_fullname");
    localStorage.removeItem("carrito");

    if (window.M) {
      M.toast({ html: "Sesión cerrada", classes: "red" });
    } else {
      alert("Sesión cerrada");
    }

    setTimeout(() => {
      window.location.href = "login.html";
    }, 800);
  });

});
