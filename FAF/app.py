#Se importan las librerias a utilizar
from flask import Flask, jsonify, request

#se crea una instancia desde flask
app = Flask(__name__)

#Lista de tareas
tareas = []
#tareas = [
#   {'id': 1, 'title': 'Comprar pan'},
#  {'id': 2, 'title': 'Estudiar Flask'},
# {'id': 3, 'title': 'Hacer ejercicio'},
#]

#GET /tasks: Devuelve la lista completa de tareas.
@app.route('/tareas', methods=['GET']) # '/' define la raiz
def get_Tarea():
    return jsonify(tareas)


#Post /task: recibe la tarea y la añade a la lista de tareas
@app.route('/tareas', methods=['POST'])
def add_tareas():
    data = request.get_json()  # Obtiene los datos y los convierte a JSON
    if not data or 'titulo_tarea' not in data:
        return jsonify({"error": "Datos incompletos"}), 400  # Responde con error 400 si faltan datos
    
    task = {  # Crea un diccionario con la tarea
        'id': len(tareas) + 1,  # Genera el ID único para la tarea
        'titulo_tarea': data['titulo_tarea']  # Extrae el título de la tarea
    }
    
    tareas.append(task)  # Agrega la tarea a la lista de tareas
    return jsonify(task), 201  # Devuelve la tarea creada con el código 201


#Delete /task: Elimina la tarea con su id
@app.route('/tareas/<int:id>',  methods=['DELETE'])
def delete_tareas(id):
    global tareas

    #Busca la tarea por su id
    eliminar_tareas = next((tarea for tarea in tareas if tarea['id']==id), None )
    if eliminar_tareas:
        tareas.remove(eliminar_tareas)# Elimina la tarea de la lista 
        return jsonify({"mensaje": f"La tareas {id} se elimino"}), 200
    else:
        return jsonify({"mensaje": f"La tareas {id} no se elimino"}), 400
    

#Inicia la app solo si se ejecuta directamente 
if __name__ == '__main__':
    app.run(debug=True)
