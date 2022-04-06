from email import message
from email.policy import default
from app import db, login_manager
from datetime import datetime
import enum
from flask_login import UserMixin


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


class userRole(enum.Enum):
    admin = "admin"
    customer = "customer"


class User(db.Model, UserMixin):
    userId = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    firstname = db.Column(db.String(20), unique=True)
    lastname = db.Column(db.String(20), unique=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    role = db.Column(db.Enum(userRole), nullable=False)


class Product(db.Model):
    productId = db.Column(db.String(30), primary_key=True)
    name = db.Column(db.String(20), unique=True, nullable=False)
    description = db.Column(db.String(200), nullable=False)
    image = db.Column(db.Text, nullable=True)
    quantity = db.Column(db.Integer, nullable=False)
    prise = db.Column(db.Float, nullable=False)
    orders = db.relationship('OrderProduct', backref='product', lazy=True)


class Order(db.Model):
    orderId = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime,  nullable=False, default=datetime.utcnow)
    result_id = db.Column(db.Integer, db.ForeignKey('result.resultId'))
    products = db.relationship('OrderProduct', backref='order', lazy=True)
    prise = db.Column(db.Float, nullable=False)


class OrderProduct(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    productId = db.Column(db.Integer, db.ForeignKey(
        'product.productId'), nullable=False)
    orderId = db.Column(db.Integer, db.ForeignKey(
        'order.orderId'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)


class Result(db.Model):
    resultId = db.Column(db.Integer, primary_key=True)
    state = db.Column(db.Boolean,  nullable=False)
    description = db.Column(db.String(200), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    image = db.Column(db.Text, nullable=False)
    read = db.Column(db.Boolean,  nullable=False, default=False)
    order = db.relationship('Order', backref='result', lazy=True)
    created_at = db.Column(db.DateTime,  nullable=False,
                           default=datetime.utcnow)


class Message(db.Model):
    messageId = db.Column(db.Integer, primary_key=True)
    read = db.Column(db.Boolean,  nullable=False, default=False)
    description = db.Column(db.String(200), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime,  nullable=False,
                           default=datetime.utcnow)
