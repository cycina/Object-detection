from app import app , db
from app.models import User,userRole
from app import bcrypt
import datetime
import jwt
from flask import request, jsonify, make_response, abort
from flask_login import login_user, current_user, logout_user, login_required

from functools import wraps


@app.route('/register', methods=['GET', 'POST'])
def signup_user():
    data = request.get_json()

    hashed_password = bcrypt.generate_password_hash(
        data['password']).decode('utf-8')

    new_user = User(username=data['username'], email=data['email'],
                    password=hashed_password, role=userRole[data['role']])
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'registered successfully'})


@app.route('/login', methods=['GET', 'POST'])
def login():

  auth = request.get_json()

  if not auth or not auth['username'] or not auth['password']:
     return make_response('could not verify', 401, {'WWW.Authentication': 'Basic realm: "login required"'})

  user = User.query.filter_by(username=auth['username']).first()
  result = []
  user_data = {}
  user_data['userId'] = user.userId
  user_data['username'] = user.username
  user_data['firstname'] = user.firstname
  user_data['lastname'] = user.lastname
  user_data['password'] = user.password
  user_data['role'] = user.role.name
  user_data['email'] = user.email
  result.append(user_data)

  if bcrypt.check_password_hash(user.password, auth['password']):
    token = jwt.encode({'userId': user.userId, 'exp': datetime.datetime.utcnow(
    ) + datetime.timedelta(minutes=30)}, app.config['SECRET_KEY'])
    return jsonify({'token': token.decode('UTF-8'),'user': result})

  return make_response('could not verify',  401, {'WWW.Authentication': 'Basic realm: "login required"'})

@app.route("/logout")
def logout():
    logout_user()
    return jsonify({'message': 'logout successfully'})


@app.route('/user', methods=['GET'])
def get_all_users():

   users = User.query.all()
   result = []

   for user in users:
       user_data = {}
       user_data['userId'] = user.userId
       user_data['username'] = user.username
       user_data['firstname'] = user.firstname
       user_data['lastname'] = user.lastname
       user_data['password'] = user.password
       user_data['role'] = user.role.name
       user_data['email'] = user.email

       result.append(user_data)

   return jsonify({'users': result})

@app.route("/user/<int:userId>", methods=['GET', 'PUT'])
def update_user(userId):
    user = request.get_json()
    if request.method == 'PUT':
        # Get the person requested from the db into session
        update_person = User.query.filter(
            User.userId == userId
        ).one_or_none()
        if update_person is None:
            abort(
                404,
                "Person not found for Id: {userId}".format(userId=userId),
            )
        else:
            user_to_update = User.query.get_or_404(userId)
            if'username' in user:
                user_to_update.username = user['username']
            if'firstname' in user:
                user_to_update.firstname = user['firstname']
            if'lastname' in user:
                user_to_update.lastname = user['lastname']
            if 'email' in user:
                user_to_update.email = user['email']
            db.session.commit()
            result = []
            user_to_update = User.query.get_or_404(userId)
            user_data = {}
            user_data['userId'] = user_to_update.userId
            user_data['username'] = user_to_update.username
            user_data['firstname'] = user_to_update.firstname
            user_data['lastname'] = user_to_update.lastname
            user_data['role'] = user_to_update.role.name
            user_data['email'] = user_to_update.email
            result.append(user_data)
            return jsonify({'user': result})
    elif request.method == 'GET':
        update_person = User.query.filter(
            User.userId == userId
        ).one_or_none()

        if update_person is None:
            abort(
                404,
                "Person not found for Id: {userId}".format(userId=userId),
            )
        else:
            result = []
            user_to_update = User.query.get_or_404(userId)
            user_data = {}
            user_data['userId'] = user_to_update.userId
            user_data['username'] = user_to_update.username
            user_data['firstname'] = user_to_update.firstname
            user_data['lastname'] = user_to_update.lastname
            user_data['role'] = user_to_update.role.name
            user_data['email'] = user_to_update.email
            user_data['image'] = user_to_update.image
            result.append(user_data)
            return jsonify({'user': result})
            
@app.route("/user/<int:userId>", methods=['DELETE'])
def delete_user(userId):
    user = User.query.get_or_404(userId)
    db.session.delete(user)
    db.session.commit()
    return jsonify('user has been deleted!', 'success')