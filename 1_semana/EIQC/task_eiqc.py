from flask import Flask, jsonify, request

app = Flask(__name__)

tasks = [
    {"id": 1, "title": "Aprender Flask"},
    {"id": 2, "title": "Subir proyecto a GitHub"}
]

#Listado en JSON 
@app.route('/tasks', methods=['GET'])
def get_tasks():
    return jsonify(tasks), 200#Codigo de solicitud HTTP

#Agregando tareas
@app.route('/tasks', methods=['POST'])
def add_task():
    data = request.get_json()
    #No campos en blanco
    if not data or 'title' not in data:
        return jsonify({"error": "El campo 'title' es obligatorio"}), 400#Codigo de movimiento HTTP
    new_task = {
        "id": len(tasks) + 1, #Con ID
        "title": data['title']
    }
    tasks.append(new_task)
    return jsonify(new_task), 201

#Eliminar por ID
@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    global tasks
    #Error de eliminación
    task_to_delete = next((task for task in tasks if task['id'] == task_id), None)
    if not task_to_delete:
        return jsonify({"error": f"Tarea con id {task_id} no encontrada"}), 404#Codigo de error de movimiento HTTP
    #Delete completo
    tasks = [task for task in tasks if task['id'] != task_id]
    return jsonify({"message": f"Tarea con id {task_id} eliminada"}), 200#Codigo aceptacion de movimiento HTTP

if __name__ == '__main__':
    app.run(debug=True)