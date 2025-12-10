document.addEventListener("DOMContentLoaded", () => {
    // 1. Obtener el ID del pedido de la URL
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('orderId');

    if (orderId) {
        // Muestra el ID en la tarjeta de resumen
        document.getElementById("orderIdDisplay").textContent = orderId;
        
        // Llama a la función para obtener los detalles del backend
        fetchOrderDetails(orderId);

        // ⚠️ Limpieza final: Borrar el carrito local UNA VEZ que el pedido está confirmado y visible
        localStorage.removeItem("carrito"); 
    } else {
        M.toast({html: "ID de pedido no encontrado en la URL", classes: "red"});
        document.getElementById("orderIdDisplay").textContent = "Error";
    }

    // 2. Evento para el botón de PAGO 
    document.getElementById("payButton").addEventListener("click", () => {
        M.toast({html: "Redireccionando a la pasarela de pagos...", classes: "blue"});
        setTimeout(() => {
            M.toast({html: "Pago exitoso! El pedido está pagado.", classes: "green"});
            document.getElementById("statusDisplay").textContent = "Pagado";
            document.getElementById("payButton").style.display = 'none'; // Esconde el botón
        }, 2000);
    });
});


/**
 * Función para llamar al backend (GET /api/v1/orders/:id) y obtener los detalles del pedido.
 */
async function fetchOrderDetails(orderId) {
    try {
        const token = localStorage.getItem("token"); 
        
        const response = await fetch(`http://localhost:3000/api/v1/orders/${orderId}`, {
            method: "GET",
            headers: { 
                "Authorization": `Bearer ${token}` 
            }
        });

        const details = await response.json();

        if (response.ok) {
            displayOrderDetails(details);
        } else {
            M.toast({html: `Error al cargar detalles: ${details.message || 'Desconocido'}`, classes: "red"});
            console.error("Detalles del error del servidor:", details);
        }

    } catch (error) {
        console.error("Error al conectar con el servidor para detalles:", error);
        M.toast({html: "Error de red al obtener detalles.", classes: "red"});
    }
}


/**
 * Función para renderizar los detalles en el HTML.
 * @param {object} details - Objeto que viene del backend.
 */
function displayOrderDetails(details) {
    
    if (!details || !details.orderId) {
        M.toast({html: "No se pudieron cargar los detalles del pedido.", classes: "red"});
        return;
    }
    
    let calculatedTotal = 0;
    const itemsList = document.getElementById("itemsList");
    const totalDisplay = document.getElementById("totalDisplay");
    itemsList.innerHTML = '<li class="collection-header"><h6>Productos Comprados</h6></li>';

    // 1. Verificar y procesar los ítems
    if (details.items && Array.isArray(details.items)) {
        
        details.items.forEach(item => {
            const subtotal = item.precio * item.cantidad; 
            calculatedTotal += subtotal;

            itemsList.innerHTML += `
                <li class="collection-item">
                    <div>
                        ${item.nombre} x ${item.cantidad}
                        <span class="secondary-content">$${subtotal}</span>
                    </div>
                </li>
            `;
        });
        totalDisplay.textContent = details.total;
        console.log("Total calculado:", details.total);
    } else {
         itemsList.innerHTML += '<li class="collection-item">No se encontraron productos en el pedido.</li>';
    }
    
    // 2. Mostrar el total y el estado

    const finalTotal = details.total || calculatedTotal; 
    document.getElementById("totalDisplay").textContent = finalTotal;
    
    if (details.status) {
        document.getElementById("statusDisplay").textContent = details.status;
    }
}