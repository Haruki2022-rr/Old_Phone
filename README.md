# OldPhoneDeals

OldPhoneDeals is a fully functioning eCommerce web application built with the MERN stack (MongoDB, Express, React, Node.js).

This project was developed as part of the coursework for COMP5347 at the University of Sydney and demonstrates the collaborative development of a three-tier web application using modern full-stack technologies.

In this project, **I was primarily responsible for the overall project structure, database design, and implementing authentication & authorization features — including secure user login, session management, and admin access control.**

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

- Node.js
- npm (comes with Node.js)
- MongoDB (local)
- MailerSend API (https://www.mailersend.com/help/how-to-start-sending-emails)

Optional tools:
- Vscode (or preferred IDE)
- MongoDB Compass (GUI for MongoDB)


## Deployment

1. Setup the backend
```bash
cd /backend
npm install 
```
create a .env file under the /backend directory with follow content.

```env
PORT=5050
MONGO_URI=mongodb://localhost:27017/oldphonedb
process.env.SENDER_NAME=COMP5347_A2
SENDER_EMAIL=YOUR_SMTP_USERNAME
MAILERSEND_API_KEY=YOUR_API_TOKEN
```
YOUR_SMTP_USERNAME and YOUR_API_TOKEN is from your MailerSend API.

2. Setup the frontend
```bash
cd ../frontend
npm install
```

3. create .env file in the /backend directory
```bash
edit .env with all of the required values(MONGO_URI=your_local_db_path)
```
4. Seed database with initial data
```bash
cd ../backend 
node seeder.js 
```
5. Start backend server
```bash
node index.js
```

6. Start frontend server
```bash
cd ../frontend
npm start
```


## Built With
- MongoDB – NoSQL database for data storage

- Express.js – Web application framework for Node.js

- React.js – Frontend JavaScript library for building user interfaces

- Node.js – JavaScript runtime environment for building the backend

- Tailwind CSS – Utility-first CSS framework for styling

- Mongoose – MongoDB object modeling tool for Node.js

- Axios – HTTP client for making API calls

- React Router – For frontend routing


## Authors

* **William Qiu** 
* **Haruki Hamada**
* **Feilian Zhou**
* **Ethan Hunt**



## Acknowledgments

- This project was completed as part of the coursework for **COMP5347** at the **University of Sydney**.  
I would like to thank the professor and the teaching staff for their guidance and support throughout the assignment.  

- Thanks to the University of Sydney tutors for guidance and support.

- MongoDB Documentation

- React Documentation

- Express Documentation

- Node.js Documentation


## extra help (after demo)
- password for all accounts is Password@1
- can use /images/[filename] for phone images
- demo dataset needs to be same name as given dataset
- /admin is admin directory
- admin user & pass is admin@gmail.com , 0000
