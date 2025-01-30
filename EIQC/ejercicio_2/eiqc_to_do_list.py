from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from models import db, User, Task

app = Flask(__name__)

#Parametros del SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'seckey'

db.init_app(app)
jwt = JWTManager(app)


with app.app_context():
    db.create_all()

#Busqueda de paths
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'El usuario ya existe'}), 400
    user = User(username=username)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'Usuario registrado exitosamente'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()

    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Credenciales inválidas'}), 401
    access_token = create_access_token(identity=user.id)
    return jsonify({'access_token': access_token}), 200

@app.route('/tasks', methods=['GET', 'POST'])
@jwt_required()
def handle_tasks():
    user_id = get_jwt_identity()

    if request.method == 'GET':
        tasks = Task.query.filter_by(user_id=user_id).all()
        return jsonify([{'id': task.id, 'title': task.title} for task in tasks]), 200
    if request.method == 'POST':
        data = request.get_json()
        new_task = Task(title=data['title'], user_id=user_id)
        db.session.add(new_task)
        db.session.commit()
        return jsonify({'message': 'Tarea creada'}), 201
    
@app.route('/tasks/<int:task_id>', methods=['DELETE'])
@jwt_required()
def delete_task(task_id):
    user_id = get_jwt_identity()
    task = Task.query.filter_by(id=task_id, user_id=user_id).first()
    if not task:
        return jsonify({'error': 'Tarea no encontrada'}), 404
    db.session.delete(task)
    db.session.commit()
    return jsonify({'message': 'Tarea eliminada'}), 200

if __name__ == '__main__':
    app.run(debug=True)
