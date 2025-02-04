from flask import Flask, jsonify, request, render_template
from models import db, Producto
from seed import seed_data

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///productos.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context(): #SeedContext
    seed_data(app)

@app.route('/productos', methods=['GET'])
def get_productos():
    productos = Producto.query.all()
    return jsonify([{
        'id': p.id, 'nombre': p.nombre, 'descripcion': p.descripcion, 'precio': p.precio
    } for p in productos])

@app.route('/productos', methods=['POST'])
def create_producto():
    data = request.get_json()
    if not all(key in data for key in ('nombre', 'descripcion', 'precio')):
        return jsonify({'error': 'Faltan datos obligatorios'}), 400
    nuevo_producto = Producto(
        nombre=data['nombre'],
        descripcion=data['descripcion'],
        precio=data['precio']
    )
    db.session.add(nuevo_producto)
    db.session.commit()
    return jsonify({'message': 'Producto creado exitosamente'}), 201

@app.route('/productos/<int:id>', methods=['PUT'])
def update_producto(id):
    data = request.get_json()
    producto = Producto.query.get_or_404(id)
    producto.nombre = data['nombre']
    producto.descripcion = data['descripcion']
    producto.precio = data['precio']
    db.session.commit()
    return jsonify({'message': 'Producto actualizado exitosamente'})

@app.route('/productos/<int:id>', methods=['DELETE'])
def delete_producto(id):
    producto = Producto.query.get_or_404(id)
    db.session.delete(producto)
    db.session.commit()
    return jsonify({'message': 'Producto eliminado exitosamente'})

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
