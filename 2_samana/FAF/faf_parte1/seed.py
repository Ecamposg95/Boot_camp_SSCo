from models import db, Producto

def seed_db():
    #checa si la tabla tiene datos
    if Producto.query.count() > 0:
        return 
    
    #Insertar datos
    productos_iniciales = [
        Producto(nombre="Cafe", descripcion="Sin cafeina", precio=45),
        Producto(nombre="Té", descripcion="Sabor Manzanilla", precio=20),
        Producto(nombre="Azucar", descripcion="1KILO", precio=38),
        Producto(nombre="Agua", descripcion="Agua en botellada", precio=15)
    ]

    db.session.bulk_save_objects(productos_iniciales)
    db.sessioncommit()