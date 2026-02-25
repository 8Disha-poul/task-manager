from flask import Blueprint, request, jsonify
from models.task_model import Task
from database import db
from services.task_service import update_task_service
task_bp = Blueprint("task_bp", __name__)

@task_bp.route("/tasks", methods=["POST"])
def add_task():
    data = request.get_json()
    new_task = Task(title=data["title"], description=data["description"])
    db.session.add(new_task)
    db.session.commit()
    return jsonify({"message": "Task added successfully"})

#list items

@task_bp.route("/tasks/completed", methods=["GET"])
def get_completed_tasks():
    try:
        completed_tasks = Task.query.filter_by(status="Completed").all()

        result = []
        for t in completed_tasks:
            result.append({
                "id": t.id,
                "title": t.title,
                "description": t.description,
                "status": t.status
            })

        return jsonify({
            "success": True,
            "data": result
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


@task_bp.route("/tasks/pending", methods=["GET"])
def get_pending_tasks():

    tasks = Task.query.filter_by(status="Pending").all()

    result = []
    for t in tasks:
        result.append({
            "id": t.id,
            "title": t.title,
            "description": t.description,
            "status": t.status
        })

    return jsonify(result), 200
@task_bp.route("/tasks/<int:task_id>/complete", methods=["PATCH"])
def mark_task_completed(task_id):

    task = Task.query.get(task_id)

    if not task:
        return jsonify({"message": "Task not found"}), 404

    task.status = "Completed"
    db.session.commit()

    return jsonify({"message": "Task marked as completed"}), 200

@task_bp.route("/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    data = request.get_json()
    return update_task_service(task_id, data)

@task_bp.route("/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):

    task = Task.query.get(task_id)

    if not task:
        return jsonify({"error": "Task not found"}), 404

    db.session.delete(task)
    db.session.commit()

    return jsonify({"message": "Task deleted"}), 200