const API_URL = "http://127.0.0.1:5000/productos";

// Obtener productos
async function getProductos() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Error al obtener productos");

        const productos = await response.json();
        const tbody = document.getElementById("productos-table");
        tbody.innerHTML = "";

        productos.forEach(p => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${p.id}</td>
                <td>${p.nombre}</td>
                <td>${p.descripcion}</td>
                <td>${p.precio}</td>
                <td>
                    <button class="delete-btn" onclick="eliminarProducto(${p.id}, this)">Eliminar</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        mostrarMensaje("Error al cargar productos", "error");
    }
}

// Agregar producto
document.getElementById("form-producto").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById("nombre").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const precio = document.getElementById("precio").value.trim();

    if (!nombre || !descripcion || !precio) {
        mostrarMensaje("Todos los campos son obligatorios", "error");
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, descripcion, precio })
        });

        if (!response.ok) throw new Error("Error al agregar producto");

        mostrarMensaje("Producto agregado con éxito", "success");
        document.getElementById("form-producto").reset();
        getProductos();
    } catch (error) {
        mostrarMensaje("No se pudo agregar el producto", "error");
    }
});

// Eliminar producto con animación
async function eliminarProducto(id, button) {
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!response.ok) throw new Error("Error al eliminar producto");

        // Animación de eliminación
        const row = button.parentElement.parentElement;
        row.style.opacity = "0";
        setTimeout(() => {
            row.remove();
            mostrarMensaje("Producto eliminado con éxito", "success");
        }, 500);
        
    } catch (error) {
        mostrarMensaje("No se pudo eliminar el producto", "error");
    }
}

// Mostrar mensajes de éxito o error
function mostrarMensaje(mensaje, tipo) {
    const mensajeDiv = document.createElement("div");
    mensajeDiv.textContent = mensaje;
    mensajeDiv.classList.add("mensaje", tipo);
    document.body.appendChild(mensajeDiv);

    setTimeout(() => {
        mensajeDiv.remove();
    }, 3000);
}

// Cargar productos al inicio
getProductos();
