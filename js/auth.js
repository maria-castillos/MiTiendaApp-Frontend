const API_URL = "http://localhost:3000/api/v1";

/* ------------------------------------
   LOGIN
------------------------------------ */
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    try {
      const res = await fetch("http://localhost:3000/api/v1/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Error al iniciar sesión");
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user?.role || 'user');
      localStorage.setItem("user_fullname", data.user?.fullname || '');
      // redirige según rol
      if ((data.user?.role || 'user') === 'admin') {
        window.location.href = "productos_admin.html";
      } else {
        window.location.href = "productos_cliente.html";
      }
    } catch (err) {
      console.error(err);
      alert("No se pudo conectar con el servidor");
    }
  });
}

/* ------------------------------------
   REGISTRO
------------------------------------ */
const registroForm = document.getElementById("registroForm");

if (registroForm) {
  registroForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullname = document.getElementById("fullname")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value.trim();
    const phone_number = document.getElementById("phone_number")?.value.trim();
    const address = document.getElementById("address")?.value.trim();

    if (!fullname || !email || !password || !phone_number) {
      if (window.M) M.toast({ html: "Completa todos los campos obligatorios" });
      else alert("Completa todos los campos obligatorios");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullname,
          email,
          password,
          phone_number,
          address
        })
      });

      const data = await res.json();

      if (!res.ok) {
        if (window.M) M.toast({ html: data.error || "No se pudo registrar" });
        else alert(data.error || "No se pudo registrar");
        return;
      }

      if (window.M) M.toast({ html: "Registro exitoso. Inicia sesión." });
      else alert("Registro exitoso. Inicia sesión.");

      window.location.href = "login.html";

    } catch (err) {
      console.error(err);
      if (window.M) M.toast({ html: "No se pudo conectar al servidor" });
      else alert("No se pudo conectar al servidor");
    }
  });
}

/* ------------------------------------
   FUNCIÓN AUXILIAR
------------------------------------ */
function getToken() {
  return localStorage.getItem("token");
}
