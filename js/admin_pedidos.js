console.log("ADMIN PEDIDOS LOADED");

const lista = document.getElementById("listaPedidosAdmin");

async function cargarPedidos() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Debes iniciar sesión");
    window.location.href = "login.html";
    return;
  }

  const res = await fetch("http://localhost:3000/api/v1/orders/all", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  const data = await res.json();

  if (!res.ok) {
    lista.innerHTML = `<li class="collection-item">No se pudieron cargar los pedidos</li>`;
    return;
  }

  lista.innerHTML = "";

  data.forEach(pedido => {
    const li = document.createElement("li");
    li.className = "collection-item";

    li.innerHTML = `
      <b>Pedido #${pedido.id}</b><br>
      Cliente: ${pedido.fullname}<br>
      Total: $${pedido.total}<br>
      Fecha: ${new Date(pedido.createdAt).toLocaleString()}
      <br><b>Productos:</b><br>
      ${pedido.items.map(i => `• ${i.product_name} (${i.quantity})`).join("<br>")}
    `;

    lista.appendChild(li);
  });
}

cargarPedidos();
