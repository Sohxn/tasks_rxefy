#flask app
from flask import Flask,request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from datetime import datetime
from bson.objectid import ObjectId


app = Flask(__name__)

#adding pymongo
app.config["SECRET_KEY"] = 'testkey'

#users
app.config["MONGO_URI"] = "mongodb://localhost:27017/task_users"
mongo = PyMongo(app)
profiles = mongo.db.users
#tasks
app.config["MONGO_URI_TASKS"] = "mongodb://localhost:27017/tasks"
mongo_tasks = PyMongo(app, uri=app.config["MONGO_URI_TASKS"])
tasks_coll = mongo_tasks.db.tasks

CORS(app)

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({"error:", "missing info cannot register"})
    
    if profiles.find_one({"email": email}):
        return jsonify({"error", "user already registered. Log in"})

    user = {
        "username": username,
        "email": email,
        "tasks": []
    }
    profiles.insert_one(user)
    return jsonify({"status":"success", "message":"User created successfully"}), 200

# @app.route('/login', methods=['POST'])
# def login():
#     pass

@app.route('/api/new_task', methods=['POST'])
def new_task():
    data = request.get_json()
    author = data.get('task_author')
    title = data.get('task_title')
    desc = data.get('task_desc')
    deadline = data.get('task_deadline')
    collabs = data.get('task_collabs')

    try:
        #assigning ids to tasks to fetch them later in tasks.jsx
        task_id = tasks_coll.insert_one({
            "author": author,
            "title": title,
            "desc": desc,
            "deadline": deadline,
            "collabs": collabs
        }).inserted_id
        #adding the task to the authors list
        profiles.update_one(
            {"email": author},
            {"$push": {"tasks": task_id}}
        )
        

        #adding shared tasks to users task list
        for c in collabs:
            profiles.update_one(
                {"email": c},
                {"$push": {"tasks": task_id}}
            )
        #i will fetch the tasks in tasks.jsx using their task_id from task_coll
        response_data = {'status':'success', 'message': 'speed updated successfully'}
        return jsonify(response_data), 200

    except Exception as e:
        return jsonify({"status": "error", "error": e}), 500

#route to fetch tasks from database
@app.route('/api/fetch_tasks/<useremail>', methods=['GET'])
def fetch_tasks(useremail):
    try:
        user = profiles.find_one({"email": useremail})
        task_ids = user.get('tasks', [])
        tasks = list(tasks_coll.find({
            '_id': {'$in': task_ids}
            })
        )
        for t in tasks:
           
            t["_id"] = str(t["_id"])
        return jsonify({"tasks": tasks}), 200
    except Exception as e:
        return jsonify({"status": "error", "error": e}), 500

@app.route('/api/delete_task/<useremail>', methods=['POST'])
def delete_task(useremail):
    try:
        user = profiles.find_one({"email": useremail})
        data = request.get_json()
        task_id = data.get('task_id')
        print(task_id)
        print(ObjectId(task_id))
        result = profiles.update_one(
            {"email": useremail},
            {"$pull": {"tasks": ObjectId(task_id)}}
        )

        if result.modified_count==0:
            print("not deleted")

        return jsonify({"status:": "success", "message": "deleted successfully"})
        
    except Exception as e:
        return jsonify({"status": "error", "error": e}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)