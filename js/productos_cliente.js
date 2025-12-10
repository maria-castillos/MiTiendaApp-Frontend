const API_URL = "http://localhost:3000/api/v1";

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Debes iniciar sesión para ver los productos");
        window.location.href = "login.html";
        return;
    }

    cargarProductos(token);

    actualizarCarritoNav();
});

/* =====================================================
   Cargar productos para el cliente
   ===================================================== */
async function cargarProductos(token) {
    try {
        const res = await fetch(`${API_URL}/products`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();

        if (data.error || data.message === "Token requerido") {
            alert("Sesión inválida, inicia sesión de nuevo.");
            localStorage.clear();
            window.location.href = "login.html";
            return;
        }

        renderizarProductos(data);

    } catch (error) {
        console.error("Error cargando productos:", error);
    }
}

/* =====================================================
   Crear tarjetas de productos en el DOM
   ===================================================== */
function renderizarProductos(productos) {
    const contenedor = document.getElementById("listaProductos");
    contenedor.innerHTML = "";

    if (productos.length === 0) {
        contenedor.innerHTML = `<p class="center">No hay productos disponibles.</p>`;
        return;
    }

    productos.forEach(prod => {
        
        // Imagen del producto
        const imagenSource = prod.imagen 
            ? `img/${prod.imagen}` 
            : 'img/default.png'; 
            
        contenedor.innerHTML += `
            <div class="col s12 m6 l4">
                <div class="card">
                    <div class="card-image">
                        <img src="${imagenSource}" alt="${prod.name}" style="height: 200px; object-fit: cover;">
                    </div>

                    <div class="card-content">
                        <span class="card-title">${prod.name}</span>
                        <p>Precio: <strong>$${prod.price}</strong></p>
                        <p>Stock: ${prod.stock}</p>
                    </div>

                    <div class="card-action center">
                        <button class="btn blue" onclick="agregarAlCarrito(${prod.id}, '${prod.name}', ${prod.price})">
                            Agregar al carrito
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
}

/* =====================================================
   AGREGAR AL CARRITO (localStorage)
   ===================================================== */
function agregarAlCarrito(id, nombre, precio) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const index = carrito.findIndex(item => item.id === id);

    if (index !== -1) {
        carrito[index].cantidad += 1;
    } else {
        carrito.push({
            id,
            nombre,
            precio,
            cantidad: 1
        });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));

    // 🔥 Actualizar contador del NAV
    actualizarCarritoNav();

    M.toast({ html: `${nombre} agregado al carrito` });
}

/* =====================================================
   MOSTRAR CONTADOR DEL CARRITO EN EL NAV
   ===================================================== */
function actualizarCarritoNav() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const badge = document.getElementById("cartCount");


    if (!badge) return;

    // Contar total de unidades
    const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);

    badge.textContent = total;
}
