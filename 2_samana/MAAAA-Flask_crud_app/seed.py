from models import db, Producto
from app import app

# Datos iniciales
productos_iniciales = [
    {"nombre": "Laptop", "descripcion": "Laptop de alta gama", "precio": 1200.50},
    {"nombre": "Smartphone", "descripcion": "Teléfono con pantalla OLED", "precio": 850.75},
    {"nombre": "Teclado Mecánico", "descripcion": "Teclado con switches rojos", "precio": 120.00}
]

# Insertar datos en la base de datos
with app.app_context():
    db.create_all()  # Asegurar que la tabla exista
    db.session.bulk_insert_mappings(Producto, productos_iniciales)
    db.session.commit()
    print("Datos insertados correctamente en la base de datos.")
