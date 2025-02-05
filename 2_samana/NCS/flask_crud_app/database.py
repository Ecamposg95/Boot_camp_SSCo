from flask_sqlalchemy import SQLAlchemy

# Crear la instancia de la base de datos
db = SQLAlchemy()

def init_db(app):
    with app.app_context():
        db.create_all()
