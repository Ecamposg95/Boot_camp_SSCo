from flask import Flask, request, jsonify

app = Flask(__name__)

# Lista para almacenar las tareas
tasks = [
    
]
task_id = 1  # Contador para asignar IDs únicos

# Obtener todas las tareas
@app.route('/tasks', methods=['GET'])
def get_tasks():
    return jsonify(tasks)

# Agregar una nueva tarea
@app.route('/tasks', methods=['POST'])
def add_task():
    global task_id
    data = request.get_json()
    if not data or 'title' not in data:
        return jsonify({'error': 'Falta el título de la tarea'}), 400

    task = {'id': task_id, 'title': data['title']}
    tasks.append(task)
    task_id += 1
    return jsonify(task), 201

# Eliminar una tarea por ID
@app.route('/tasks/<int:id>', methods=['DELETE'])
def delete_task(id):
    global tasks
    tasks = [task for task in tasks if task['id'] != id]
    return jsonify({'message': 'Tarea eliminada'}), 200

if __name__ == '__main__':
    app.run(debug=True)
