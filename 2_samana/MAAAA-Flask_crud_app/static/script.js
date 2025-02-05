document.addEventListener("DOMContentLoaded", () => {
    fetchProductos();
});

// Obtener productos y mostrarlos en la tabla
function fetchProductos() {
    fetch("/productos")
        .then(response => response.json())
        .then(data => {
            const tabla = document.getElementById("tabla-productos");
            tabla.innerHTML = "";  
            data.forEach(producto => {
                let row = `<tr>
                    <td>${producto.id}</td>
                    <td>${producto.nombre}</td>
                    <td>${producto.descripcion}</td>
                    <td>${producto.precio.toFixed(2)}</td>
                    <td>
                        <button onclick="editarProducto(${producto.id})">Editar</button>
                        <button onclick="eliminarProducto(${producto.id})">Eliminar</button>
                    </td>
                </tr>`;
                tabla.innerHTML += row;
            });
        })
        .catch(error => console.error("Error al obtener productos:", error));
}

// Agregar un producto
function agregarProducto() {
    const nombre = document.getElementById("nombre").value;
    const descripcion = document.getElementById("descripcion").value;
    const precio = parseFloat(document.getElementById("precio").value);

    fetch("/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, descripcion, precio })
    })
    .then(response => response.json())
    .then(() => {
        fetchProductos(); // Recargar la lista
    })
    .catch(error => console.error("Error al agregar producto:", error));
}

// Eliminar un producto
function eliminarProducto(id) {
    fetch(`/productos/${id}`, { method: "DELETE" })
    .then(() => {
        fetchProductos(); // Recargar la lista
    })
    .catch(error => console.error("Error al eliminar producto:", error));
}

// Editar un producto
function editarProducto(id) {
    const nuevoNombre = prompt("Nuevo nombre:");
    const nuevaDescripcion = prompt("Nueva descripción:");
    const nuevoPrecio = parseFloat(prompt("Nuevo precio:"));

    fetch(`/productos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nuevoNombre, descripcion: nuevaDescripcion, precio: nuevoPrecio })
    })
    .then(() => {
        fetchProductos(); // Recargar la lista
    })
    .catch(error => console.error("Error al editar producto:", error));
}

