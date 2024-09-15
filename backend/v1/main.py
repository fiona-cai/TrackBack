import flask
from ultralytics import YOLO
from dotenv import load_dotenv, find_dotenv
from flask import request, jsonify, send_file
from tasks import my_task
import os
import cv2
from io import BytesIO
from flask_cors import CORS
import tempfile
import boto3

load_dotenv(find_dotenv())


PORT = os.environ.get("PORT") or 8080
BUCKET_NAME = os.environ.get("S3_BUCKET_NAME")
AWS_SECRET_KEY = os.environ.get("AWS_SECRET_KEY")
AWS_ACCESS_KEY = os.environ.get("AWS_ACCESS_KEY")
AWS_REGION = os.environ.get("AWS_REGION")
S3_BUCKET_NAME = os.environ.get("S3_BUCKET_NAME")

s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY,
    region_name=AWS_REGION,
)

app = flask.Flask(__name__)

CORS(app)


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
    print("JAJAJJA")
    chunk = int(chunk)
    frame = int(frame)
    try:
        # Convert frame to integer
        frame_number = int(frame)

        # Construct the S3 key
        s3_key = f"video_chunk_{chunk}.mp4"

        print(s3_key)

        # Download the video chunk from S3
        response = s3_client.get_object(Bucket=S3_BUCKET_NAME, Key=s3_key)
        video_content = response["Body"].read()

        # Create a temporary file
        with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as temp_file:
            temp_filename = temp_file.name
            temp_file.write(video_content)

        try:
            # Load the video using OpenCV
            video = cv2.VideoCapture(temp_filename)

            # Set the frame position
            video.set(cv2.CAP_PROP_POS_FRAMES, frame_number)

            # Read the frame
            success, image = video.read()

            if not success:
                return "Frame not found", 404

            # Convert the image to JPEG format
            _, buffer = cv2.imencode(".jpg", image)

            # Create a BytesIO object from the buffer
            img_io = BytesIO(buffer)

            # Send the image file
            return send_file(img_io, mimetype="image/jpeg")

        finally:
            # Close the video capture
            video.release()
            # Remove the temporary file
            os.unlink(temp_filename)

    except Exception as e:
        print(f"Error: {str(e)}")
        return f"Error processing request: {str(e)}", 500


if __name__ == "__main__":
    app.run(debug=True, port=PORT)
