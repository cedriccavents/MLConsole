from flask import Flask
from flask_cors import CORS

from routes.preprocessing import data_blueprint

app = Flask(__name__)
app.register_blueprint(data_blueprint)

CORS(app)

if __name__ == '__main__':
    app.run(port=3000)

