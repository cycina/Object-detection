from app import app
from flask_cors import CORS

if __name__ == '__main__':
    app.run(debug=False, threaded=True)
    flask_cors.CORS(app, expose_headers='Authorization')
