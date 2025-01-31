from flask import Flask, request, jsonify 
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # ID del usuario
    username = db.Column(db.String(80), unique=True, nullable=False)  # Nombre de usuario único
    password_hash = db.Column(db.String(120), nullable=False)  # Contraseña cifrada

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # ID de la tarea
    task = db.Column(db.String(255), nullable=False)  # Descripción de la tarea
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Relación con el usuario
