from flask import Flask
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)

@app.route('/connection_test')
@cross_origin()
def connected():
    return "Hello World, this is a successful connection"


if __name__ == "__main__":
    app.run(debug=True)
