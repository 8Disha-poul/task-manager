from models.task_model import Task
from database import db

def add_task_service(data):
    title = data.get("title")
    description = data.get("description")

    if not title:
        return {"error": "Title is required"}, 400

    new_task = Task(
        title=title,
        description=description
    )

    db.session.add(new_task)
    db.session.commit()

    return {
        "message": "Task added successfully",
        "task": new_task.to_dict()
    }, 201




def get_completed_tasks_service():
    tasks = Task.query.filter_by(status="Completed").all()

    result = []
    for task in tasks:
        result.append({
            "id": task.id,
            "title": task.title,
            "description": task.description,
            "status": task.status
        })

    return result

def update_task_service(task_id, data):

    task = Task.query.get(task_id)

    if not task:
        return {"error": "Task not found"}, 404

    task.title = data.get("title", task.title)
    task.description = data.get("description", task.description)

    db.session.commit()

    return {
        "message": "Task updated successfully",
        "task": task.to_dict()
    }, 200