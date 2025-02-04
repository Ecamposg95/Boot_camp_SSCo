from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

# Modelo Usuario: como se almacena los usuarios
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # Id único para cada usuario
    username = db.Column(db.String(25), unique=True, nullable=False)  # Nombre del usuario
    password = db.Column(db.String(100), nullable=False)  # Contraseña del usuario

    # Relación uno a muchos con Tarea
    tareas = db.relationship('Tarea', backref='propietario', lazy=True)

    def __repr__(self):
        return f'<User {self.username}>'

# Modelo Tarea: almacena las tareas del usuario
class Tarea(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # Id de la tarea
    titulo_tarea = db.Column(db.String(100), nullable=False)  # Título de la tarea
    propietario_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Relación con el id del usuario

    def __repr__(self):
        return f'<Tarea {self.titulo_tarea}>'

    # Devolver la tarea como diccionario
    def to_dict(self):
        return {
            'id': self.id,
            'titulo_tarea': self.titulo_tarea,
            'propietario': self.propietario.username  # Accede al nombre del propietario con la relación
        }

