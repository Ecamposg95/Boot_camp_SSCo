# Importamos la clase Flask desde el paquete flask
from flask import Flask

# Se crea una instancia de la aplicación Flask
app = Flask(__name__)

# Define una ruta básica para la URL raíz "/"
@app.route('/')
def hola_mundo():
    """
    Esta función retorna un mensaje de "Hola Mundo" 
    que se mostrará en el navegador.
    """
    return "Hola Mundo desde Flask "

# Iniciamos la aplicación Flask en el puerto 5000
# Esto se asegura de que la aplicación solo corra cuando el archivo sea ejecutado directamente
if __name__ == '__main__':
   
    app.run(debug=True)
