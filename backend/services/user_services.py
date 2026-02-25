from database import db
from flask_bcrypt import Bcrypt
from models.user_model import User
from flask_jwt_extended import create_access_token

bcrypt = Bcrypt()

def register_user(name, email, password):
    # Check if user already exists
    if User.query.filter_by(email=email).first():
        return None  # or raise error

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")
    new_user = User(name=name, email=email, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return new_user

def authenticate_user(email, password):
    user = User.query.filter_by(email=email).first()
    if user and bcrypt.check_password_hash(user.password, password):
        return user
    return None

def generate_token(user):
    return create_access_token(identity=user.id)
