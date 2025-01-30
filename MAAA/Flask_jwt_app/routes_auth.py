from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from models import db, Usuario

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({"msg": "Datos incompletos"}), 400

    if Usuario.query.filter_by(username=data['username']).first():
        return jsonify({"msg": "Usuario ya registrado"}), 400

    nuevo_usuario = Usuario(username=data['username'])
    nuevo_usuario.set_password(data['password'])
    
    db.session.add(nuevo_usuario)
    db.session.commit()
    
    return jsonify({"msg": "Usuario registrado exitosamente"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    usuario = Usuario.query.filter_by(username=data['username']).first()

    if usuario and usuario.check_password(data['password']):
        access_token = create_access_token(identity=usuario.id)
        return jsonify(access_token=access_token), 200
    return jsonify({"msg": "Credenciales inválidas"}), 401
