from flask import Flask, jsonify, request

# Inicializa la aplicación Flask
app = Flask(__name__)

# Lista de tareas (almacenamiento en memoria)
tasks = []

# Genera el próximo ID único para una tarea
def get_next_id():
    return max((task['id'] for task in tasks), default=0) + 1

# Ruta para obtener todas las tareas
@app.route('/tasks', methods=['GET'])
def get_tasks():
    return jsonify(tasks)

# Ruta para agregar una nueva tarea
@app.route('/tasks', methods=['POST'])
def add_task():
    data = request.get_json()  # Obtiene el JSON enviado en la solicitud
    if not data or 'title' not in data:  # Valida que el título esté presente
        return jsonify({"error": "El campo 'title' es requerido"}), 400
    
    new_task = {"id": get_next_id(), "title": data['title']}  # Crea la nueva tarea
    tasks.append(new_task)  # Agrega la tarea a la lista
    return jsonify(new_task), 201  # Retorna la nueva tarea con un código de éxito

# Ruta para eliminar una tarea por su ID
@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    global tasks
    if any(task['id'] == task_id for task in tasks):  # Verifica si la tarea existe
        tasks = [task for task in tasks if task['id'] != task_id]  # Elimina la tarea
        return '', 204  # Retorna una respuesta vacía con código de éxito
    return jsonify({"error": "Tarea no encontrada"}), 404  # Retorna error si no se encuentra la tarea

# Inicia la aplicación en modo debug
if __name__ == '__main__':
    app.run(debug=True)
