import os
import requests
import datetime

from flask import Flask, render_template, redirect, request, jsonify, session
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.secret_key = "secret"
app.config["SECRET_KEY"] = "secret"
socketio = SocketIO(app)

users = []

messages = {"cs50": [["David", "Hi people!", [1, 1, 2020], [12, 10, 12]], ["Sergei", "This topic will discuss homework.", [2, 1, 2020], [14, 19, 54]], ["Dan", "Hi!", [14, 1, 2020], [12, 10, 12]], ["David", "Who has done at least one task?", [14, 1, 2020], [12, 10, 12]]],
            "Numbers": []
            }

for num in range(99):
    messages["Numbers"].append(["Sergei", str(num+1), [10, 10, 2020], [12, 10, 12]])

@app.route("/")
def index():
    topics = messages.keys()
    return render_template("index.html", topics=topics, topicNone=True)

@app.route("/log", methods=["POST"])
def login():
    login = int(request.form.get("login"))
    name = request.form.get("name")

    print(login)

    if login > 0:
        if len(name) < 2 or name == "":
            return jsonify({"success": False, "message": "Invalid name."})

        if name in users:
            return jsonify({"success": False, "message": "The name is already taken."})
        else:
            users.append(name)
            return jsonify({"success": True})
    else:
        users.remove(name)
        return jsonify({"success": True})

@app.route("/topic", methods=["POST"])
def topic():
    topic = request.form.get("topic")
    add = int(request.form.get("add"))
    topics = messages.keys()

    if add > 0:
        if len(topic) < 2 or topic == "":
            return jsonify({"success": False, "message": "Invalid name."})

        if topic in topics:
            return jsonify({"success": False, "message": "The topic with what name already exists."})
        else:
            messages[topic] = []
            return jsonify({"success": True})
    else:
        messages.pop(topic)
        return jsonify({"success": True})

@app.route("/<topic>")
def messanger(topic):

    topics = messages.keys()
    messagess = messages[topic]

    return render_template("index.html", 
                            topics=topics, 
                            topic=topic,
                            messages=messagess,
                            topicNone=False)

@socketio.on("submit message")
def message(data):
    topic = data['topic']
    user = data['user']
    message = data['message']

    now = datetime.datetime.now()
    date = [now.day, now.month, now.year]
    time = [now.hour, now.minute, now.second]
    overflow = False

    if len(messages[topic])>100:
        messages[topic].pop(0)
        overflow = True

    messages[topic].append([user, message, date, time])

    response = {"topic": topic, 'user': user, 'message': message, 'date': date, 'time': time, 'overflow': overflow}

    emit("message response", response, broadcast=True)

@socketio.on("delete message")
def delMessage(data):
    topic = data['topic']
    ind = data['index']

    messagesInTopic = messages[topic]

    messagesInTopic.pop(ind)

    response = {"index": ind, "topic": topic}

    emit("delete message response", response, broadcast=True)

if __name__ == '__main__':
    socketio.run(app)
