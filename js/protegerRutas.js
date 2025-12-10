const token = localStorage.getItem("token");
const role = localStorage.getItem("role");
const path = window.location.pathname;

// Si no hay token → no está logueado
if (!token) {
  window.location.href = "login.html";
}

const adminRoutes = [
  "/productos_admin.html"
];

const clientRoutes = [
  "/productos_cliente.html",
  "/mis_pedidos.html",
  "/carrito.html"
];

// Usuario normal intentando entrar a rutas de admin
if (role === "user" && adminRoutes.some(r => path.endsWith(r))) {
  window.location.href = "productos_cliente.html";
}

// Admin intentando entrar a rutas de cliente
if (role === "admin" && clientRoutes.some(r => path.endsWith(r))) {
  window.location.href = "productos_admin.html";
}
