from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from models import db
from routes_auth import auth_bp
from routes_tasks import tasks_bp

app = Flask(__name__)

# Configuración de la base de datos y JWT
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'supersecretkey'  # Cambia esto por una clave segura

# Inicialización de extensiones
db.init_app(app)
jwt = JWTManager(app)

# Registro de Blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(tasks_bp)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Crea las tablas si no existen
    app.run(debug=True)

