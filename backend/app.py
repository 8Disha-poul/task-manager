# from flask import Flask
# from database import db
# from routes.task_routes import task_bp
# from flask_cors import CORS

# app = Flask(__name__)
# CORS(app)

# app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:Sidheshwar%40123@localhost/task_manager'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# db.init_app(app)
# app.register_blueprint(task_bp)

# with app.app_context():
#     db.create_all()

# if __name__ == "__main__":
#     app.run(debug=True)

import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from database import db
from routes.task_routes import task_bp
from routes.user_routes import user_bp
from flask_jwt_extended import JWTManager  # <-- add this

import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Get values from .env


SECRET_KEY = os.getenv("JWT_SECRET_KEY")

DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL and DATABASE_URL.startswith("mysql://"):
    DATABASE_URL = DATABASE_URL.replace(
        "mysql://", "mysql+pymysql://", 1
    )
# Configure Database
app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URL
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# JWT Config
app.config["JWT_SECRET_KEY"] = SECRET_KEY

# Initialize DB
db.init_app(app)

# Initialize JWT
jwt = JWTManager(app)  # <-- MUST add this

# Register blueprints
app.register_blueprint(task_bp)
app.register_blueprint(user_bp, url_prefix="/api/users")

import models
# Create tables
with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)