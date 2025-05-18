# OldPhoneDeals_TuT10_G4

This project is a fully functioning eCommerce web application named OldPhoneDeals. This project will demonstrate our ability to collaboratively build a three-tier web application using the MERN stack (MongoDB, Express, React, Node.js).

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

- Node.js
- npm (comes with Node.js)
- MongoDB (local)
- MailerSend API

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

- Thanks to the University of Sydney tutors for guidance and support.

- MongoDB Documentation

- React Documentation

- Express Documentation

- Node.js Documentation
