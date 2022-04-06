from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

app.config['UPLOAD_FOLDER'] = 'app/uploads/'
app.config['ALLOWED_EXTENSIONS'] = set(
    ['png', 'jpg', 'jpeg', 'PNG', 'JPG', 'JPEG', 'gif', 'GIF'])
app.config['SECRET_KEY']='Th1s1ss3cr3t'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)


from app import user_routes, product_routes , order_routes, result_routes
from app.models import *