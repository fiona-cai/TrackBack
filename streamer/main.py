import cv2
import boto3
from botocore.exceptions import NoCredentialsError
import time
from dotenv import load_dotenv, find_dotenv
import os
import requests

load_dotenv(find_dotenv())

cam = cv2.VideoCapture(0) #capturing the computer webcam (0 -- first camera)

# Check if the camera opened successfully
if not cam.isOpened():
    print("Error: Could not open camera.")
else:
    print("Camera opened successfully.")

    chunk_duration = 10 #setting the chunk duration to 10 seconds 

s3 = boto3.client('s3', 
                  aws_access_key_id=os.getenv("AWS_ACCESS_KEY"),
                  aws_secret_access_key=os.getenv("AWS_SECRET_KEY")) #creating an instance of a client (s3)

def upload_s3(file_name, bucket, object_name=None):
    if object_name is None:
        object_name = file_name
    try:
        s3.upload_file(file_name, bucket, object_name)
        print(f"Uploaded {file_name} to {bucket}/{object_name}")
    except NoCredentialsError:
        print("Credentials not available.")

def send_post_req(chunk_id):
    requests.post(os.getenv("API_URL"), json={
        "chunk_id": chunk_id
    })

#function to figure out how to upload files to s3
# fps = int(cam.get(cv2.CAP_PROP_FPS))  #frames per second of video capture 
fps = 20 # change this to get camera to be roughly same speed as processing

width = int(cam.get(cv2.CAP_PROP_FRAME_WIDTH))
height = int(cam.get(cv2.CAP_PROP_FRAME_HEIGHT))

fourcc = cv2.VideoWriter_fourcc(*'mp4v')
chunk_index = 0 #chunk index 0 to loop 
# try:
while True:
    out_filename = f"video_chunk_{chunk_index}.mp4" #each video will be named according to their 
    #chunk of belonging (video_chunk_0.mp4)
    out = cv2.VideoWriter(out_filename, fourcc, fps, (width, height))
    start_time = time.time () #measuring current time as it iterates through the loop 
    while (time.time() - start_time) < chunk_duration:
            ret, frame = cam.read()
            if ret:
                out.write(frame)
            else:
                print("Error: Failed to capture frame.")
                break
    out.release()
    chunk_index +=1 #increases chunk_index

# except KeyBoardInterrupt:
#     print ("video recording stopped by user")

#upload to s3 
    upload_s3(out_filename, os.getenv("BUCKET_NAME"))
    send_post_req(chunk_index)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break