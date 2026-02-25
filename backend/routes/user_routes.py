from flask import Blueprint, request, jsonify
from services.user_services import register_user, authenticate_user, generate_token

user_bp = Blueprint("user_bp", __name__)

@user_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    user = register_user(data["name"], data["email"], data["password"])
    if not user:
        return jsonify({"message": "Email already exists"}), 400
    return jsonify({"message": "User registered"}), 201

@user_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = authenticate_user(data["email"], data["password"])
    if not user:
        return jsonify({"message": "Invalid email or password"}), 401

    token = generate_token(user)

    return jsonify({
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }
    }), 200
