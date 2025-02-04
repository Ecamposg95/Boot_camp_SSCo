from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Tarea

tasks_bp = Blueprint('tasks', __name__)

@tasks_bp.route('/tasks', methods=['GET'])
@jwt_required()
def get_tasks():
    user_id = get_jwt_identity()
    tasks = Tarea.query.filter_by(user_id=user_id).all()
    return jsonify([{"id": task.id, "title": task.title} for task in tasks])

@tasks_bp.route('/tasks', methods=['POST'])
@jwt_required()
def add_task():
    data = request.get_json()
    user_id = get_jwt_identity()

    new_task = Tarea(title=data['title'], user_id=user_id)
    db.session.add(new_task)
    db.session.commit()

    return jsonify({"msg": "Tarea creada exitosamente"}), 201

@tasks_bp.route('/tasks/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_task(id):
    user_id = get_jwt_identity()
    task = Tarea.query.filter_by(id=id, user_id=user_id).first()

    if not task:
        return jsonify({"msg": "Tarea no encontrada"}), 404

    db.session.delete(task)
    db.session.commit()
    
    return jsonify({"msg": "Tarea eliminada"}), 200
