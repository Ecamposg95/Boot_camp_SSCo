from flask import Flask, request, jsonify
from flask_cors import CORS
from database import db, init_db
from models import Producto

app = Flask(__name__)
CORS(app)

# Configuración de la base de datos
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///productos.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Inicializar la base de datos con la app
db.init_app(app)

# Crear las tablas si no existen
init_db(app)

# Rutas de la API
@app.route("/productos", methods=["GET"])
def get_productos():
    productos = Producto.query.all()
    return jsonify([p.to_dict() for p in productos])

@app.route("/productos", methods=["POST"])
def create_producto():
    data = request.json
    nuevo_producto = Producto(
        nombre=data["nombre"], 
        descripcion=data["descripcion"], 
        precio=data["precio"]
    )
    db.session.add(nuevo_producto)
    db.session.commit()
    return jsonify(nuevo_producto.to_dict()), 201

@app.route("/productos/<int:id>", methods=["PUT"])
def update_producto(id):
    producto = Producto.query.get_or_404(id)
    data = request.json
    producto.nombre = data.get("nombre", producto.nombre)
    producto.descripcion = data.get("descripcion", producto.descripcion)
    producto.precio = data.get("precio", producto.precio)
    db.session.commit()
    return jsonify(producto.to_dict())

@app.route("/productos/<int:id>", methods=["DELETE"])
def delete_producto(id):
    producto = Producto.query.get_or_404(id)
    db.session.delete(producto)
    db.session.commit()
    return jsonify({"message": "Producto eliminado"})

if __name__ == "__main__":
    app.run(debug=True)
