const API_URL = "http://localhost:3000/api/v1";

/* =====================================================
   SERVICIO — CONSUME LA API
   ===================================================== */
class ProductoService {

    static async listar(token) {
        const res = await fetch(`${API_URL}/products`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        return await res.json();
    }

    static async crear(token, data) {
        const res = await fetch(`${API_URL}/products`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        return await res.json();
    }

    static async actualizar(token, id, data) {
        const res = await fetch(`${API_URL}/products/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        return await res.json();
    }

    static async eliminar(token, id) {
        const res = await fetch(`${API_URL}/products/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
        return await res.json();
    }

    static async actualizarStock(token, id, stock) {
        const res = await fetch(`${API_URL}/products/${id}/stock`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ stock })
        });
        return await res.json();
    }
}

/* =====================================================
   UI — MANEJA EL DOM
   ===================================================== */
class ProductoUI {

    constructor() {

        /* =====================================================
           🔐 VALIDACIÓN DE LOGIN + ROL ADMIN
        ===================================================== */
        this.token = localStorage.getItem("token");
        this.role = localStorage.getItem("role") || "user";

        if (!this.token) {
            alert("Debes iniciar sesión");
            window.location.href = "login.html";
            return;
        }

        if (this.role !== "admin") {
            alert("Acceso denegado: Solo administradores");
            window.location.href = "productos_cliente.html"; // vista cliente
            return;
        }

        /* =====================================================
           CONTINÚA TU INICIALIZACIÓN NORMAL
        ===================================================== */
        this.tabla = document.getElementById("tablaProductos");

        // Inicializar Materialize
        this.iniciarModales();
        this.agregarEventos();

        // Cargar productos al inicio
        this.cargarProductos();
    }

    iniciarModales() {
        M.Modal.init(document.querySelectorAll('.modal'));
        this.modalCrear = M.Modal.getInstance(document.getElementById("modalCrear"));
        this.modalEditar = M.Modal.getInstance(document.getElementById("modalEditar"));
    }

    agregarEventos() {

        document.getElementById("formCrear").addEventListener("submit", (e) => {
            e.preventDefault();
            this.crearProducto();
        });

        document.getElementById("formEditar").addEventListener("submit", (e) => {
            e.preventDefault();
            this.guardarEdicion();
        });
    }

    /* -------------------- CARGAR LISTADO -------------------- */
    async cargarProductos() {
        const productos = await ProductoService.listar(this.token);

        this.tabla.innerHTML = productos.map(p => `
            <tr>
                <td>${p.name}</td>
                <td>$${p.price}</td>
                <td>${p.stock}</td>
                <td>
                    <button class="btn-small blue" onclick="ui.abrirEditar(${p.id}, '${p.name}', ${p.price}, ${p.stock})">
                        <i class="material-icons">edit</i>
                    </button>

                    <button class="btn-small red" onclick="ui.eliminar(${p.id})">
                        <i class="material-icons">delete</i>
                    </button>

                    <button class="btn-small orange" onclick="ui.cambiarStock(${p.id}, ${p.stock})">
                        <i class="material-icons">add_shopping_cart</i>
                    </button>
                </td>
            </tr>
        `).join("");
    }

    /* -------------------- CREAR -------------------- */
    async crearProducto() {
        const data = {
            name: document.getElementById("create_name").value,
            price: parseFloat(document.getElementById("create_price").value),
            stock: parseInt(document.getElementById("create_stock").value)
        };

        const res = await ProductoService.crear(this.token, data);

        if (res.error) {
            alert("Error: " + res.error);
            return;
        }

        M.toast({ html: "Producto creado" });
        this.modalCrear.close();
        this.cargarProductos();
    }

    /* -------------------- ABRIR MODAL EDITAR -------------------- */
    abrirEditar(id, name, price, stock) {
        document.getElementById("edit_id").value = id;
        document.getElementById("edit_name").value = name;
        document.getElementById("edit_price").value = price;
        document.getElementById("edit_stock").value = stock;

        M.updateTextFields(); 

        this.modalEditar.open();
    }

    /* -------------------- GUARDAR EDICIÓN -------------------- */
    async guardarEdicion() {
        const id = document.getElementById("edit_id").value;

        const data = {
            name: document.getElementById("edit_name").value,
            price: parseFloat(document.getElementById("edit_price").value),
            stock: parseInt(document.getElementById("edit_stock").value)
        };

        const res = await ProductoService.actualizar(this.token, id, data);

        if (res.error) {
            alert("Error: " + res.error);
            return;
        }

        M.toast({ html: "Producto actualizado" });
        this.modalEditar.close();
        this.cargarProductos();
    }

    /* -------------------- ELIMINAR -------------------- */
    async eliminar(id) {
        if (!confirm("¿Seguro que deseas eliminar este producto?")) return;

        const res = await ProductoService.eliminar(this.token, id);

        if (res.error) {
            alert("Error: " + res.error);
            return;
        }

        M.toast({ html: "Producto eliminado" });
        this.cargarProductos();
    }

    /* -------------------- CAMBIAR STOCK -------------------- */
    async cambiarStock(id, stockActual) {
        const nuevo = prompt("Nuevo stock:", stockActual);

        if (nuevo === null) return;
        if (isNaN(nuevo) || nuevo < 0) {
            alert("Valor inválido");
            return;
        }

        const res = await ProductoService.actualizarStock(this.token, id, parseInt(nuevo));

        if (res.error) {
            alert("Error: " + res.error);
            return;
        }

        M.toast({ html: "Stock actualizado" });
        this.cargarProductos();
    }
}

/* =====================================================
   INSTANCIA GLOBAL
   ===================================================== */
let ui;

document.addEventListener("DOMContentLoaded", () => {
    ui = new ProductoUI();
});
