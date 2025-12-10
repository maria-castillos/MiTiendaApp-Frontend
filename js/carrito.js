document.addEventListener("DOMContentLoaded", () => {
    mostrarCarrito();
});


function mostrarCarrito() {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const lista = document.getElementById("listaCarrito");
    const totalEl = document.getElementById("totalCarrito");

    lista.innerHTML = "";
    let total = 0;

    if (carrito.length === 0) {
        lista.innerHTML = `
            <li class="collection-item center">
                Tu carrito está vacío.
            </li>
        `;
        totalEl.textContent = "0";
        return;
    }

    carrito.forEach(item => {
        total += item.precio * item.cantidad;

        lista.innerHTML += `
            <li class="collection-item avatar">
                <i class="material-icons circle blue">shopping_cart</i>

                <span class="title"><strong>${item.nombre}</strong></span>
                <p>
                    Precio: $${item.precio}<br>
                    Cantidad: ${item.cantidad}
                </p>

                <div class="secondary-content" style="display:flex; gap:10px; align-items:center;">
                    <button class="btn-small green" onclick="cambiarCantidad(${item.id}, +1)">
                        <i class="material-icons">add</i>
                    </button>

                    <button class="btn-small orange" onclick="cambiarCantidad(${item.id}, -1)">
                        <i class="material-icons">remove</i>
                    </button>

                    <button class="btn-small red" onclick="eliminarProducto(${item.id})">
                        <i class="material-icons">delete</i>
                    </button>
                </div>
            </li>
        `;
    });

    totalEl.textContent = total;
}


/* =====================================================
   AUMENTAR O DISMINUIR CANTIDAD
   ===================================================== */
function cambiarCantidad(id, cambio) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const index = carrito.findIndex(item => item.id === id);
    if (index === -1) return;

    carrito[index].cantidad += cambio;

    // Si la cantidad llega a 0, eliminar
    if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1);
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
}


/* =====================================================
   ELIMINAR PRODUCTO DEL CARRITO
   ===================================================== */
function eliminarProducto(id) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    carrito = carrito.filter(item => item.id !== id);

    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();

    M.toast({ html: "Producto eliminado" });
}

document.getElementById("confirmarPedido").addEventListener("click", async () => {

    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];


    if (carrito.length === 0) {
        M.toast({html: "El carrito está vacío", classes: "red"});
        return;
    }
    const items = carrito.map(item => ({
        productId: item.id,
        cantidad: item.cantidad
    }));
    const body = {items};

    try {

        const token = localStorage.getItem("token"); 

        const response = await fetch("http://localhost:3000/api/v1/orders", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`  
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (response.ok) {
            
            const orderId = data.orderId;
            
            M.toast({html: "Pedido confirmado. ID: " + orderId, classes: "green"});
            window.location.href = `pedido_confirmado.html?orderId=${orderId}`;

        } else {
            const errorMessage = data.message || data.error || "Error al procesar el pedido. Revisa el servidor.";
            M.toast({html: "Error: " + errorMessage, classes: "red"});
        }

    } catch (error) {
        console.error(error);
    }
});

