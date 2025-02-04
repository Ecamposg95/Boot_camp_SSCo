async function fetchProductos() {
    const response = await fetch('/productos');
    const productos = await response.json();
    const tbody = document.querySelector('#productosTable tbody');
    tbody.innerHTML = '';

    productos.forEach(p => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${p.id}</td>
            <td>${p.nombre}</td>
            <td>${p.descripcion}</td>
            <td>${p.precio}</td>
        `;
        const tdAcciones = document.createElement('td');
        const btnEdit = document.createElement('button');
        btnEdit.innerHTML = `Edit <svg class="svg" viewBox="0 0 512 512"><path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231z"></path></svg>`;
        btnEdit.classList.add('Btn');
        btnEdit.onclick = () => editProducto(p.id);

        const btnDelete = document.createElement('button');
        btnDelete.classList.add('noselect');
        btnDelete.innerHTML = `
            <span class="text">Delete</span>
            <span class="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path>
                </svg>
            </span>`;
        btnDelete.onclick = () => deleteProducto(p.id);

        tdAcciones.appendChild(btnEdit);
        tdAcciones.appendChild(btnDelete);
        tr.appendChild(tdAcciones);
        tbody.appendChild(tr);
    });
}

fetchProductos();

async function addProducto() {
    const nombre = prompt("Nombre del producto:");
    const descripcion = prompt("Descripción del producto:");
    const precio = parseFloat(prompt("Precio del producto:"));

    if (!nombre || !descripcion || isNaN(precio)) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    const response = await fetch('/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, descripcion, precio })
    });

    if (response.ok) {
        alert("Producto agregado exitosamente.");
        fetchProductos(); // Actualiza la tabla
    } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
    }
}


async function deleteProducto(id) {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
        await fetch(`/productos/${id}`, { method: 'DELETE' });
        fetchProductos();
    }
}

async function editProducto(id) {
    const nombre = prompt("Nuevo nombre del producto:");
    const descripcion = prompt("Nueva descripción del producto:");
    const precio = parseFloat(prompt("Nuevo precio del producto:"));

    if (!nombre || !descripcion || isNaN(precio)) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    const response = await fetch(`/productos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, descripcion, precio })
    });

    if (response.ok) {
        alert("Producto modificado exitosamente.");
        fetchProductos(); // Actualiza la tabla
    } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
    }
}
fetchProductos();
