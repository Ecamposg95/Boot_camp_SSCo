from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, Tarea  # Importa db correctamente

app = Flask(__name__)


# Configuración de la base de datos SQLite 
#app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root@localhost/api_token_todolist'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Desactiva la notificación de modificaciones
app.config['JWT_SECRET_KEY'] = "secret_key"  # Clave secreta para JWT

# Inicializar la base de datos
db.init_app(app)

# Instancias
jwt = JWTManager(app)

# Ruta para registrar nuevos usuarios
@app.route('/register', methods=['POST'])
def registro():
    data = request.get_json()  # Obtener los datos JSON

    # Obtener usuario y contraseña
    username = data.get('usuario')
    password = data.get('contraseña')

    # Verifica si el usuario ya existe
    if User.query.filter_by(username=username).first():
        return jsonify(message="Este usuario ya existe"), 400

    # Crea al usuario y contraseña
    new_user = User(username=username, password=password)

    # Agrega al usuario a la BD y lo guarda
    db.session.add(new_user)
    db.session.commit()

    return jsonify(message="Se ha registrado exitosamente"), 201


# Ruta para el inicio de sesión con token
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('usuario')
    password = data.get('contraseña')
    user = User.query.filter_by(username=username, password=password).first()  # Busca al usuario

    # Si no lo encuentra, manda un mensaje de error 401
    if not user:
        return jsonify(message="Es invalido"), 401

    # Crea el token
    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token)  # Devuelve el token


# Ruta para obtener las tareas del usuario (autenticado)
@app.route('/tareas', methods=['GET'])
@jwt_required()  # Asegura que el usuario esté autenticado
def get_tareas():
    username = get_jwt_identity()  # Obtiene el usuario con el token JWT

    # Verifica si el usuario existe
    usuario = User.query.filter_by(username=username).first()
    if not usuario:
        return jsonify(message="Usuario no encontrado"), 404

    # Obtiene las tareas asociadas con el usuario
    tareas = Tarea.query.filter_by(propietario_id=usuario.id).all()

    # Crea una lista de diccionarios con las tareas
    tareas_list = [{"id": tarea.id, "titulo_tarea": tarea.titulo_tarea, "propietario": tarea.propietario.username} for tarea in tareas]
    
    return jsonify({"tareas": tareas_list}), 200


#Post /task: recibe la tarea y la añade a la lista de tareas
@app.route('/tareas', methods=['POST'])
@jwt_required()
def add_tareas():
    data = request.get_json()  # Obtiene los datos y los convierte a JSON
    titulo_tarea = data.get('titulo_tarea')
    username = get_jwt_identity()

    # Obtener el objeto User asociado al username
    propietario = User.query.filter_by(username=username).first()

    if not propietario:
        return jsonify(message="Usuario no encontrado"), 404

    nueva_tarea = Tarea(titulo_tarea=titulo_tarea, propietario=propietario)

    # Agrega y guarda en la base de datos
    db.session.add(nueva_tarea)
    db.session.commit()

    return jsonify(message="Se ha creado la tarea"), 201

#Delete /task: Elimina la tarea con su id
@app.route('/tareas/<int:id>',  methods=['DELETE'])
@jwt_required() 
def delete_tareas(id):
    username = get_jwt_identity()  # Obtiene el usuario autenticado desde el token JWT
    # Busca al usuario en la base de datos por su username
    usuario = User.query.filter_by(username=username).first()

    if not usuario:  # Si el usuario no existe, retorna un error
        return jsonify(message="Usuario no encontrado"), 404

    # Busca la tarea por su id y verifica que el propietario_id coincida con el usuario
    tarea = Tarea.query.filter_by(id=id, propietario_id=usuario.id).first()

    if not tarea:  # Si la tarea no existe o no es del usuario, retorna un error
        return jsonify(message="No tienes permisos para eliminar esta tarea o la tarea no existe"), 404

    # Elimina la tarea y guarda los cambios
    db.session.delete(tarea)
    db.session.commit()

    return jsonify(message="Tarea eliminada con éxito"), 200


if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Crear tablas si no existen
    app.run(debug=True)
