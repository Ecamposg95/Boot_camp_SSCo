from flask import Flask, app 

app = Flask(__name__)

@app.route('/')
def hello():

    return '¡Hola, mundo desde Flask!.'

if app == 'main':
    app.run(debug=True)
