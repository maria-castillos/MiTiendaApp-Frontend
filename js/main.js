document.addEventListener('DOMContentLoaded', () => {
  const productos = [
    { id: 1, nombre: 'De Todito Natural', precio: 18850, imagen: 'img/producto1.jpg' },
    { id: 2, nombre: 'Coca cola 1.5lt', precio: 6500, imagen: 'img/producto2.jpg' },
    { id: 3, nombre: 'Mr Brownie', precio: 3800, imagen: 'img/producto3.jpg' }
  ];

  const listaProductos = document.getElementById('listaProductos');
  const listaCarrito = document.getElementById('listaCarrito');
  const totalCarritoElem = document.getElementById('totalCarrito');
  const btnConfirmar = document.getElementById('confirmarPedido');

  // Mostrar productos
  if (listaProductos) {
    productos.forEach(prod => {
      const card = document.createElement('div');
      card.classList.add('col', 's12', 'm4');
      card.innerHTML = `
        <div class="card">
          <div class="card-image">
            <img src="${prod.imagen}" alt="${prod.nombre}">
          </div>
          <div class="card-content">
            <span class="card-title">${prod.nombre}</span>
            <p>Precio: $${prod.precio}</p>
          </div>
          <div class="card-action center">
            <button class="btn blue" onclick="agregarAlCarrito(${prod.id})">Agregar</button>
          </div>
        </div>
      `;
      listaProductos.appendChild(card);
    });
  }

  // Mostrar carrito
  if (listaCarrito) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.forEach(prod => {
      const item = document.createElement('li');
      item.classList.add('collection-item');
      item.textContent = `${prod.nombre} - $${prod.precio}`;
      listaCarrito.appendChild(item);
    });

    const total = carrito.reduce((acc, producto) => acc + producto.precio, 0);
    totalCarritoElem.textContent = total.toFixed(2);
  }

  // Confirmar pedido
  if (btnConfirmar) {
    btnConfirmar.addEventListener('click', () => {
      localStorage.removeItem('carrito');
      window.location.href = 'pedido_confirmado.html';
    });
  }
});

// Agregar al carrito
function agregarAlCarrito(id) {
  const productos = [
    { id: 1, nombre: 'De Todito Natural', precio: 18850 },
    { id: 2, nombre: 'Coca cola 1.5lt', precio: 6500 },
    { id: 3, nombre: 'Mr Brownie', precio: 3800 }
  ];

  const producto = productos.find(p => p.id === id);
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  carrito.push(producto);
  localStorage.setItem('carrito', JSON.stringify(carrito));

  M.toast({ html: `${producto.nombre} agregado al carrito`, classes: 'green' });
}
