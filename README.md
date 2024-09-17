<div align="center">
  
![MacBook Air - 1 (1)](https://github.com/user-attachments/assets/3ac05f13-0da3-42b0-9af6-17fe09ecb854)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![OpenCV](https://img.shields.io/badge/OpenCV-5C3EE8?style=for-the-badge&logo=opencv&logoColor=white)
![YOLO](https://img.shields.io/badge/YOLO-00FFFF?style=for-the-badge)
![S3](https://img.shields.io/badge/S3-569A31?style=for-the-badge&logo=amazon-s3&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Voiceflow](https://img.shields.io/badge/Voiceflow-1F2937?style=for-the-badge)
![Figma](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
</div>
> Picture this: 
Your world is familiar, yet fading. You reach for your glasses, but they’re gone. You check the usual spots for your keys, but they aren’t there. Every day, simple tasks become a puzzle, a battle against memory.

## What it does 🧠
TrackBack continuously records the environment using a camera and leverages object detection through YOLOv4 to identify and log objects, providing bounding boxes, the location, the label, and the most prominent colour. When users forget where an item was placed, they can type a query like "Where is my brown mug?" on our web app. An LLM (powered by Voiceflow) will access an image of the object along with object details stored by the YOLO model to provide instructions on where the object is.

One of our key features is the chat function. We understand that seniors tend to have a hard time with technology, so having a chat feature that mimics real-life conversations could help them use this software. 

## How we built it 🛠️
We used YOLOv4 for object detection, transforming and labelling detected objects in a real-time feed and their associated metadata (bounding boxes, labels, locations, colours) into a structured format accessible by Voiceflow. The data is stored in a tabular format to ensure it is compatible with Voiceflow's LLM, which handles the user queries and retrieves relevant object information. 

Our front-end was first designed in Figma and then implemented in React.js. The information displayed comes from calling the Voiceflow API.

## Challenges we ran into 🧗
- Understanding how Voiceflow flows
- Working around how to store and format the data from the YOLOV4 model to make it accessible for Voiceflow, pivoting from submitting a JSON file to a CSV.
- Figuring out how to stream the videos from our phones to the S3 database.

## Accomplishments that we're proud of 🌟
- Finding a plausible solution to a problem we're all passionate about
- Developing a functional minimum viable product that entails a YOLOv4 model that seamlessly integrates with Voiceflow through an intuitive user interface
- Building an easy-to-navigate, and ✨aesthetic✨user interface

## What we learned 🔍
- A CSV file in a table format is the most optimal way of storing the data passed by YOLOv4, as it is compatible with the LLM as opposed to storing it and passing it through a direct JSON file.
- How to take in camera footage and stream the frames in 15-second segments to S3 
- The importance of designing a simple user interface for senior citizens suffering from dementia to easily navigate 

## What's next for TrackBack💡
- Integrating voice commands can enable voice-based queries for users who may find typing difficult or not possible. 
- Adapting the current tool into an easy-to-navigate, user-friendly mobile application for improved access across devices 
- Adding a map feature that provides the user directions to where the object is located for misplaced items outside of one's home
- Creating a collaborative memory base where multiple users can share camera footage to help find a misplaced object with improved efficiency 
