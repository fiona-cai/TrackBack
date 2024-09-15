import cv2
import boto3
from botocore.exceptions import NoCredentialsError
import time
from dotenv import load_dotenv, find_dotenv
import os
import requests
import logging

# Set up logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)

# Load environment variables
load_dotenv(find_dotenv())

# S3 client setup
s3 = boto3.client(
    "s3",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY"),
    aws_secret_access_key=os.getenv("AWS_SECRET_KEY"),
)


def upload_to_s3(file_name, bucket, object_name=None):
    if object_name is None:
        object_name = file_name
    try:
        s3.upload_file(file_name, bucket, object_name)
        logging.info(f"Uploaded {file_name} to {bucket}/{object_name}")
        return True
    except NoCredentialsError:
        logging.error("Credentials not available")
        return False
    except Exception as e:
        logging.error(f"Error uploading to S3: {str(e)}")
        return False


def send_post_request(chunk_id):
    try:
        response = requests.post(os.getenv("API_URL"), json={"chunk_id": chunk_id})
        response.raise_for_status()
        logging.info(f"POST request sent for chunk {chunk_id}")
    except requests.exceptions.RequestException as e:
        logging.error(f"Error sending POST request: {str(e)}")


def capture_and_upload_video():
    cam = cv2.VideoCapture(3)
    if not cam.isOpened():
        logging.error("Error: Could not open camera.")
        return

    logging.info("Camera opened successfully.")

    chunk_duration = 10  # seconds
    fps = 5
    width = int(cam.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cam.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    chunk_index = 0

    try:
        while True:
            out_filename = f"video_chunk_{chunk_index}.mp4"
            out = cv2.VideoWriter(out_filename, fourcc, fps, (width, height))
            start_time = time.time()
            frames_written = 0

            while (time.time() - start_time) < chunk_duration:
                ret, frame = cam.read()
                if ret:
                    out.write(frame)
                    frames_written += 1

                    # Display the frame (optional, for debugging)
                    cv2.imshow("frame", frame)
                else:
                    logging.warning("Failed to capture frame.")
                    break

                if cv2.waitKey(1) & 0xFF == ord("q"):
                    raise KeyboardInterrupt

            out.release()
            logging.info(
                f"Chunk {chunk_index} recorded. Frames written: {frames_written}"
            )

            if frames_written > 0:
                if upload_to_s3(out_filename, os.getenv("S3_BUCKET_NAME")):
                    send_post_request(chunk_index)
                    os.remove(
                        out_filename
                    )  # Remove the local file after successful upload
                else:
                    logging.warning(
                        f"Failed to upload {out_filename}. Keeping local copy."
                    )
            else:
                logging.warning(
                    f"No frames were written to {out_filename}. Skipping upload."
                )
                os.remove(out_filename)

            chunk_index += 1

    except KeyboardInterrupt:
        logging.info("Video recording stopped by user.")
    finally:
        cam.release()
        cv2.destroyAllWindows()


if __name__ == "__main__":
    capture_and_upload_video()
