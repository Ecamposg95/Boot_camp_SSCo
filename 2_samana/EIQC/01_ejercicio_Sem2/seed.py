from models import db, Producto

def seed_data(app):
    with app.app_context():
        db.drop_all()
        db.create_all()
        productos = [
            Producto(nombre="Laptop", descripcion="Laptop de última generación", precio=1500.00),
            Producto(nombre="Mouse", descripcion="Mouse ergonómico", precio=25.50),
            Producto(nombre="Teclado", descripcion="Teclado mecánico", precio=75.00),
        ]
        db.session.add_all(productos)
        db.session.commit()
        print("Base de datos inicializada con datos de prueba.")
