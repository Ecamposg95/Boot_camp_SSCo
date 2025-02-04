from flask import Flask, jsonify, request

app = Flask(__name__)

# Lista de tareas (simulación)
tasks = []

@app.route('/tasks', methods=['GET', 'POST'])
def tasks_list():
    if request.method == 'POST':
        new_task = {'id': len(tasks) + 1, 'title': request.json['title']}
        tasks.append(new_task)
        return jsonify({'message': 'Tarea creada correctamente', 'task': new_task}), 201
    else:
        return jsonify({'tasks': tasks})

@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    # ... (código para eliminar una tarea por su ID)
    return jsonify({'message': 'Tarea eliminada correctamente'})

if __name__ == '__main__':
    app.run(debug=True)

    