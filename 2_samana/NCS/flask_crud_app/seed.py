from app import app
from database import db
from models import Producto

# Crear la base de datos
with app.app_context():
    db.create_all()

    # Insertar productos de prueba
    if Producto.query.count() == 0:
        productos = [
            Producto(nombre="Laptop", descripcion="Laptop de alta gama", precio=1500.99),
            Producto(nombre="Mouse", descripcion="Mouse inalámbrico", precio=25.99),
            Producto(nombre="Teclado", descripcion="Teclado mecánico", precio=89.99)
        ]
        db.session.add_all(productos)
        db.session.commit()
        print("Base de datos inicializada con productos.")
    else:
        print("La base de datos ya contiene datos.")
