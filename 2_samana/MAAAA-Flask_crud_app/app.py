from flask import Flask, request, jsonify, render_template
from models import db, Producto

app = Flask(__name__)

# Configuración de la base de datos SQLite
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

@app.route("/")
def index():
    return render_template("index.html")

# Obtener todos los productos
@app.route("/productos", methods=["GET"])
def get_productos():
    productos = Producto.query.all()
    return jsonify([producto.to_dict() for producto in productos])

# Agregar un nuevo producto
@app.route("/productos", methods=["POST"])
def add_producto():
    data = request.json
    nuevo_producto = Producto(
        nombre=data["nombre"],
        descripcion=data["descripcion"],
        precio=data["precio"]
    )
    db.session.add(nuevo_producto)
    db.session.commit()
    return jsonify(nuevo_producto.to_dict()), 201

# Modificar un producto existente
@app.route("/productos/<int:id>", methods=["PUT"])
def update_producto(id):
    producto = Producto.query.get(id)
    if not producto:
        return jsonify({"error": "Producto no encontrado"}), 404

    data = request.json
    producto.nombre = data.get("nombre", producto.nombre)
    producto.descripcion = data.get("descripcion", producto.descripcion)
    producto.precio = data.get("precio", producto.precio)

    db.session.commit()
    return jsonify(producto.to_dict())

# Eliminar un producto
@app.route("/productos/<int:id>", methods=["DELETE"])
def delete_producto(id):
    producto = Producto.query.get(id)
    if not producto:
        return jsonify({"error": "Producto no encontrado"}), 404

    db.session.delete(producto)
    db.session.commit()
    return jsonify({"mensaje": "Producto eliminado"}), 200

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)

