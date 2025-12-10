// protect.js 
function protectPage(allowedRoles = []) {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
 

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    if (!allowedRoles.includes(role)) {
        if (role === "admin") {
            window.location.href = "productos_admin.html";
        } else {
            window.location.href = "productos_cliente.html";
        }
    }
}

window.protectPage = protectPage;
