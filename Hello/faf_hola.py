#Se importan las librerias a utilizar
from flask import Flask

#se crea una instancia desde flask
app = Flask(__name__)

#Se define la ruta principal que devolvera el mensaje
@app.route('/') # '/define la raiz'
def hola_mundo():
    """ Responde el mensaje HOLA MUNDO cuando se accede a la url """
    return 'Hola Mundo con Flask!!!'

#Inicia la app solo si se ejecuta directamente
if __name__ == '__main__':
    app.run(debug=True, port=5001) #inicia el servidor