from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from models import User, Task, db
from database import init_db

# Crear la aplicación Flask
app = Flask(__name__)

# Configuración de la aplicación
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root@localhost/tasks'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'mysecretkey'  # Cambiar por una clave más segura

# Inicializar las extensiones
jwt = JWTManager(app)

# Inicializar la base de datos
init_db(app)

# Ruta de registro (POST /register)
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data['username']
    password = data['password']

    if User.query.filter_by(username=username).first():
        return jsonify({"msg": "El usuario ya existe"}), 400

    new_user = User(username=username, password=password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "Usuario registrado exitosamente"}), 201

# Ruta de login (POST /login)
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']

    user = User.query.filter_by(username=username, password=password).first()

    if not user:
        return jsonify({"msg": "Credenciales incorrectas"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({"access_token": access_token}), 200

# Ruta para ver las tareas (GET /tasks)
@app.route('/tasks', methods=['GET'])
@jwt_required()
def get_tasks():
    current_user_id = get_jwt_identity()  # Aquí se usa get_jwt_identity
    tasks = Task.query.filter_by(user_id=current_user_id).all()
    tasks_list = [{"id": task.id, "task": task.task} for task in tasks]
    return jsonify({"tasks": tasks_list}), 200

# Ruta para agregar una nueva tarea (POST /tasks)
@app.route('/tasks', methods=['POST'])
@jwt_required()
def add_task():
    data = request.get_json()
    task_description = data['task']
    current_user_id = get_jwt_identity()

    new_task = Task(task=task_description, user_id=current_user_id)
    db.session.add(new_task)
    db.session.commit()

    return jsonify({"msg": "Tarea agregada exitosamente"}), 201

# Ruta para eliminar una tarea (DELETE /tasks/<id>)
@app.route('/tasks/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_task(id):
    current_user_id = get_jwt_identity()
    task = Task.query.filter_by(id=id, user_id=current_user_id).first()

    if not task:
        return jsonify({"msg": "Tarea no encontrada"}), 404

    db.session.delete(task)
    db.session.commit()

    return jsonify({"msg": "Tarea eliminada exitosamente"}), 200

if __name__ == '__main__':
    app.run(debug=True)
