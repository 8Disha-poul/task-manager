from database import db


class Task(db.Model):
    __tablename__ = "task"

    id = db.Column(db.Integer, primary_key=True)               # Auto-increment ID
    title = db.Column(db.String(100), nullable=False)          # Task title
    description = db.Column(db.String(255), nullable=False)    # Task description
    status = db.Column(db.String(20), default="Pending")       # Task status (Pending/Done)

    def __repr__(self):
        return f"<Task {self.title} - {self.status}>"



    # def to_dict(self):
    #     return {
    #         "id": self.id,
    #         "title": self.title,
    #         "description": self.description,
    #         "status": self.status,
    #     }
