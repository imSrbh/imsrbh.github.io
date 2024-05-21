---
layout: page
title: Projects
subtitle: What's been eating away my free time
comments: true
carbonads: true
---
This is a collection of some personal projects I've worked on that are easily viewable online. Anything that is not browser-friendly will not make the cut :(

___
## 1. Context Aware Chatbot with Unstructured/Structured Data
Code: [Custom AI ChatBot](https://github.com/imSrbh/CustomAICHatBot)  
• Utilized SQLAlchemy as the data connector for both SQL and BigQuery databases, enabling the generation of SQL queries for given natural language input queries, leveraging llama-index capabilities.  
• Created analyzer charts and natural language response based on the generated SQL output and OpenAI’s APIs and vectorDB to facilitate chatbot interactions with the unstructured data.    
## 2. Queue detection and length Estimation using Deepstream  
Code: [QueueDetection DS App](https://github.com/imSrbh/Queue_Detection-Length_Estimation-Deepstream)  
• Developed a Deepstream application to detect the Queue and estimate the Queue length. PeopleNet model for detecting people and convex hull is being used for finding the Queue vector which is basically a line [ y = mx + c] using People Detection.  

## 3. Flask ML API : Salary Predictor App
Code : [SalaryPredictApp](https://github.com/imSrbh/DeployML-Flask/tree/master/SalaryPredictApp)  
In this project, a simple Linear Regression has been trained for salary prediction using scikit-learn and then a flask web app created.
There are core three files in the code repo:  
_model.py_ : We are gonna develop and train our model.    
_server.py_ : We will code to handle POST requests and return the results.  
_request.py_ : and Finally, we will send the requests with the features with the server and recieve the results.  

## 4. Setting UP JupyterHub using Docker
Repo : [TLJH_Docker](https://github.com/imSrbh/TLJH_Docker.git)  
In this project, I had setup a JupyterHub on the local server using docker and docker-compose. Once the setup is completed Admin can create multiple user with basic authentication and multiple user can work on the data recides on that server. This is purely containerized application.  
Here you can find detailed User Guide : [Blog](https://imsaurabh.me/SettingUPtljh/)


## 5. Building a Happiness detector using Haar Cascade
Repo : [Happiness-Detector](https://github.com/imSrbh/Happiness-Detector.git)  
Building an AI that sees emotions can be highly valuable in some markets. Imagine if you were able to detect people's emotions when they are watching movies. That would have very strong impact to the cinema industry and bring significant added value to companies like Netflix or Time Warner for which you could build powerful recommender systems based on Computer Vision applications able to understand emotions.
___  

