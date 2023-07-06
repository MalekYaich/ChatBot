# ChatBot

## Project overview : 

This project involves the development of an Arabic-language chatbot designed to answer frequently asked questions in the field of mental health. The chatbot also includes the functionality of sending voice messages.
The data for the chatbot is collected through web scraping from an online health forum. The collected data is then processed using Natural Language Processing (NLP) algorithms and modeled using machine learning techniques.

#### The project includes the following files and components:

* chatbot.html: This file represents the front-end of the chatbot and is written in HTML, CSS, and JavaScript.
* ChatBot_web_scraping.ipynb: This file contains the code for data collection using web scraping techniques. It retrieves the necessary information from the online health forum.
* ChatBot_modelisation.ipynb: This file focuses on NLP processing and the implementation of the machine learning algorithm. It includes the code for training and evaluating the chatbot model.
* ChatBot_preparation_data.ipynb: This file is responsible for data pre-processing in order to build a database of frequently asked questions and their corresponding answers. It utilizes NLP pre-processing methods to clean and prepare the data.
* data.json: This file contains the question-answer database that is used by the chatbot. It serves as the central repository of information for the chatbot to retrieve answers from.
* model.h5 and model.json: These files represent the structure and weights of the machine learning model that has been trained for the chatbot. They are used for loading and using the model during chatbot operations.

