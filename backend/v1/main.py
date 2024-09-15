import flask
from ultralytics import YOLO
from dotenv import load_dotenv, find_dotenv
from flask import request, jsonify
from tasks import my_task
import os

load_dotenv(find_dotenv())


PORT = os.environ.get("PORT") or 8080

app = flask.Flask(__name__)


@app.get("/")
def health_check():
    return "Server is running", 200


@app.post("/")
def new_chunk():
    # Get JSON data from the request body
    data = request.get_json()

    print(data)

    my_task.delay(data)

    return (jsonify({"message": "Job created"}), 200)


@app.get("/<chunk>/<frame>")
def get_frame(chunk, frame):
    print(chunk, frame)


if __name__ == "__main__":
    app.run(debug=True, port=PORT)
