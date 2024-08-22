---
layout: page
title: Projects
subtitle: What's been eating away my free time
comments: true
carbonads: true
---
This is a collection of some personal projects I've worked on that are easily viewable online. Anything that is not browser-friendly will not make the cut :(

___
## Image Similarity Search using CLIP Model
Code: [ImageSimilaritySearch](https://github.com/imSrbh/ImageSimilaritySearch)  
• This project leverages OpenAI's CLIP model to create an image search application that allows users to search for images based on text descriptions. The process begins by collecting and preprocessing images from a specified folder, then generating embeddings for each image using the CLIP model. These embeddings are saved in a pickle file for later use.  
• The Streamlit app enables users to input a search term, which is then converted into a text embedding. The app computes cosine similarity scores between this text embedding and the precomputed image embeddings, ranking the images by similarity. The top-ranked images are displayed in a user-friendly format, with customization options for the number of search results and image display size.  

## Generate Survey Questions on given Persona and Goal
Code: [MetaformsAISurvey](https://github.com/imSrbh/MetaformsAISurvey)  
• This Streamlit-based application allows users to generate goals and corresponding survey questions using OpenAI's GPT model.   
The app features two main functionalities:   
    (1) Users can input a persona and domain to generate goals, which can then be used to create survey questions, and   
    (2) Users can directly input their own goals to generate survey questions across three iterations.   
• The app integrates a sidebar for users to enter their OpenAI API key securely and includes links to the relevant GitHub repository and prompt files. The generated survey questions are displayed in expandable sections for each iteration, providing a clear and organized user experience.  

## Context Aware Chatbot with Unstructured/Structured Data
Code: [Custom AI ChatBot](https://github.com/imSrbh/CustomAICHatBot)  
• Utilized SQLAlchemy as the data connector for both SQL and BigQuery databases, enabling the generation of SQL queries for given natural language input queries, leveraging llama-index capabilities.  
• Created analyzer charts and natural language response based on the generated SQL output and OpenAI’s APIs and vectorDB to facilitate chatbot interactions with the unstructured data.    
## Queue detection and length Estimation using Deepstream  
Code: [QueueDetection DS App](https://github.com/imSrbh/Queue_Detection-Length_Estimation-Deepstream)  
• Developed a Deepstream application to detect the Queue and estimate the Queue length. PeopleNet model for detecting people and convex hull is being used for finding the Queue vector which is basically a line [ y = mx + c] using People Detection.  

## Flask ML API : Salary Predictor App
Code : [SalaryPredictApp](https://github.com/imSrbh/DeployML-Flask/tree/master/SalaryPredictApp)  
In this project, a simple Linear Regression has been trained for salary prediction using scikit-learn and then a flask web app created.
There are core three files in the code repo:  
_model.py_ : We are gonna develop and train our model.    
_server.py_ : We will code to handle POST requests and return the results.  
_request.py_ : and Finally, we will send the requests with the features with the server and recieve the results.  

## Setting UP JupyterHub using Docker
Repo : [TLJH_Docker](https://github.com/imSrbh/TLJH_Docker.git)  
In this project, I had setup a JupyterHub on the local server using docker and docker-compose. Once the setup is completed Admin can create multiple user with basic authentication and multiple user can work on the data recides on that server. This is purely containerized application.  
Here you can find detailed User Guide : [Blog](https://imsaurabh.me/SettingUPtljh/)


## Building a Happiness detector using Haar Cascade
Repo : [Happiness-Detector](https://github.com/imSrbh/Happiness-Detector.git)  
Building an AI that sees emotions can be highly valuable in some markets. Imagine if you were able to detect people's emotions when they are watching movies. That would have very strong impact to the cinema industry and bring significant added value to companies like Netflix or Time Warner for which you could build powerful recommender systems based on Computer Vision applications able to understand emotions.
___  

