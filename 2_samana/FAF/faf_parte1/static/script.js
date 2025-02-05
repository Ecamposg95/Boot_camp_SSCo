const API_URL = "http://127.0.0.1:5000/productos";

document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
    
    document.getElementById("product-form").addEventListener("submit", (e) => {
        e.preventDefault();
        addProduct();
    });
});

// Cargar productos
function loadProducts() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById("product-list");
            tbody.innerHTML = "";
            data.forEach(producto => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${producto.id}</td>
                    <td>${producto.nombre}</td>
                    <td>${producto.descripcion}</td>
                    <td>${producto.precio}</td>
                    <td>
                        <button onclick="edit_productos(${producto.id})" class="edit">Editar</button>
                        <button onclick="delete_productos(${producto.id})" class="delete">Eliminar</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(error => console.error("Error al cargar productos:", error));
}

// Agregar producto
function addProduct() {
    const nombre = document.getElementById("nombre").value;
    const descripcion = document.getElementById("descripcion").value;
    const precio = document.getElementById("precio").value;

    console.log("Enviando datos:", { nombre, descripcion, precio });

    fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, descripcion, precio })
    })
    .then(response => {
        console.log("Respuesta recibida:", response);
        return response.json();
    })
    .then(data => {
        console.log("Producto agregado:", data);
        document.getElementById("product-form").reset();
        loadProducts();
    })
    .catch(error => console.error("Error al agregar producto:", error));
}



// Eliminar producto
function delete_productos(id) {
    fetch(`${API_URL}/${id}`, { method: "DELETE" })
        .then(response => response.json())
        .then(() => loadProducts())
        .catch(error => console.error("Error al eliminar producto:", error));
}

// Editar producto (simulación, puedes hacer un modal)
function edit_productos(id) {
    const nuevoNombre = prompt("Nuevo nombre:");
    const nuevaDescripcion = prompt("Nueva descripción:");
    const nuevoPrecio = prompt("Nuevo precio:");

    if (nuevoNombre && nuevaDescripcion && nuevoPrecio) {
        fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre: nuevoNombre, descripcion: nuevaDescripcion, precio: nuevoPrecio })
        })
        .then(response => response.json())
        .then(() => loadProducts())
        .catch(error => console.error("Error al editar producto:", error));
    }
}
