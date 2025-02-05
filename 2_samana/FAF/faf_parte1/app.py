from flask import Flask, request, jsonify, render_template
from models import db, Producto
from seed import seed_db

app = Flask(__name__)

# Configuración de la base de datos SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar la base de datos
db.init_app(app)

# Crear la base de datos y las tablas si no existen
with app.app_context():
    db.create_all()
    ##seed_db()  # Insertar datos iniciales

@app.route("/")
def index():
    return render_template("index.html")  


# Ruta GET /productos: Obtener todos los productos
@app.route('/productos', methods=['GET'])
def get_productos():
    productos = Producto.query.all()
    return jsonify([producto.to_dict() for producto in productos])


# Ruta POST /productos: Crear un nuevo producto
@app.route('/productos', methods=['POST'])
def add_producto():
    data = request.get_json()
    #nombre = data.get('nombre')
    #descripcion = data.get('descripcion')
    #precio = data.get('precio')
    
    nuevo_producto = Producto(nombre=data['nombre'], descripcion=data['descripcion'], precio=data['precio'])
    db.session.add(nuevo_producto)
    db.session.commit()
    return jsonify({'message': 'Producto agreado'}), 201

# Ruta PUT /productos/<id>: Modificar un producto existente
@app.route('/productos/<int:id>', methods=['PUT'])
def update_producto(id):
    data = request.get_json()
    producto = Producto.query.get_or_404(id)
    producto.nombre = data['nombre']
    producto.descripcion = data['descripcion']
    producto.precio = data['precio']
    
    db.session.commit()
    return jsonify({'message': 'Producto actualizado'})

# Ruta DELETE /productos/<id>: Eliminar un producto
@app.route('/productos/<int:id>', methods=['DELETE'])
def delete_producto(id):
    producto = Producto.query.get_or_404(id)
    db.session.delete(producto)
    db.session.commit()
    return jsonify({'message': 'Producto eliminado'})

if __name__ == '__main__':
    app.run(debug=True)
