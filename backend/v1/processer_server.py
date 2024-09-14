import cv2
import boto3
import os
import json
import numpy as np
import tempfile
from ultralytics import YOLO
from dotenv import load_dotenv, find_dotenv
import flask
from flask import request
import requests
import io

load_dotenv(find_dotenv())

app = flask.Flask(__name__)

BUCKET_NAME = os.environ.get("S3_BUCKET_NAME")
AWS_SECRET_KEY = os.environ.get("AWS_SECRET_KEY")
AWS_ACCESS_KEY = os.environ.get("AWS_ACCESS_KEY")
PORT = os.environ.get("PORT_2") or 9090
AWS_REGION = os.environ.get("AWS_REGION")
VOICEFLOW_SECRET_ACCESS_KEY = os.environ.get("VOICEFLOW_SECRET_ACCESS_KEY")

s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY,
    region_name=AWS_REGION,
)

# Load YOLOv5 model
model = YOLO("yolov8n.pt", verbose=False)


def download_video_from_s3(key):
    """
    Download a video file from S3 and save it locally.

    :param key: S3 object key
    :return: Path to the downloaded video file
    """
    # Create a temporary file to store the downloaded video
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4")
    temp_file_path = temp_file.name
    temp_file.close()

    # Download the file from S3
    print(key)
    s3_client.download_file(BUCKET_NAME, key, temp_file_path)

    return temp_file_path


def run_yolov_on_video(video_path):
    """
    Process a video file using YOLOv8 for object detection and store the average color of each detected object.

    :param video_path: Path to the input video file
    :return: List of detections for each frame, including object color
    """
    cap = cv2.VideoCapture(video_path)
    detections = []

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        # Perform object detection on the frame
        results = model(frame)

        # Store detections for this frame
        frame_detections = []
        for r in results:
            boxes = r.boxes
            for box in boxes:
                x1, y1, x2, y2 = map(
                    int, box.xyxy[0].tolist()
                )  # Bounding box coordinates
                conf = box.conf.item()  # Confidence score
                cls = int(box.cls.item())  # Class ID
                label = model.names[cls]  # Label name

                # Crop the object region from the frame to calculate the color
                object_img = frame[y1:y2, x1:x2]
                if object_img.size > 0:  # Ensure the cropped region is not empty
                    avg_color_per_row = np.average(object_img, axis=0)
                    avg_color = np.average(
                        avg_color_per_row, axis=0
                    ).tolist()  # Convert to list for JSON-like format
                else:
                    avg_color = [0, 0, 0]  # Assign black color if the crop fails

                frame_detections.append(
                    {
                        "box": [x1, y1, x2, y2],
                        "confidence": conf,
                        "class": cls,
                        "label": label,
                        "color": avg_color,  # Store average color of the object
                    }
                )

        detections.append(frame_detections)

    cap.release()
    return detections


def upload_json_to_voiceflow(detections, file_name):
    """
    Upload detection results as a JSON file to Voiceflow.

    :param detections: List of detections
    :param file_name: File name in VoiceFlow
    """
    # Convert detections to JSON-serializable format
    json_detections = json.dumps(detections)

    # Create an in-memory bytes buffer for the JSON data
    json_file = io.BytesIO(json_detections.encode("utf-8"))

    url = "https://api.voiceflow.com/v1/knowledge-base/docs/upload?maxChunkSize=1000"

    headers = {
        "accept": "application/json",
        "Authorization": VOICEFLOW_SECRET_ACCESS_KEY,
    }

    # Prepare the file to be uploaded as multipart/form-data
    files = {"file": (file_name, json_file, "application/json")}

    requests.post(url, headers=headers, files=files)


@app.get("/")
def health_check():
    return "Server is running", 200


@app.post("/")
def process():
    data = request.get_json()

    print(f"Processing {data}")

    # Extract chunk ID and generate the key
    chunk_id = int(data["chunk_id"]) - 1
    key = f"video_chunk_{chunk_id}.mp4"

    # Download MP4 file from S3
    video_path = download_video_from_s3(key)

    # Process the video with YOLOv5
    detections = run_yolov_on_video(video_path)

    # Save the detection results as JSON
    json_key = f"{chunk_id}_detections.json"
    upload_json_to_voiceflow({"chunk_id": chunk_id, "detections": detections}, json_key)

    # Cleanup the downloaded file
    os.remove(video_path)

    return f"Processed {data}"


if __name__ == "__main__":
    app.run(debug=True, port=PORT)
