// Reference https://medium.com/@sindoojagajam2023/setting-up-your-first-mern-stack-project-a-step-by-step-tutorial-0a4f88fa4e98
// This file is entry point.
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors'); //To enable cross-origin requests
require('dotenv').config(); // To store sentitve info in .env file
const app = express();
const PORT = process.env.PORT || 5000;
const oldPhoneDeals = require("./routes/oldPhoneDeals.routes");
const session = require("express-session");

// Middleware

//allow cross origin from port 3000 to 5000/5050
app.use(cors(
  {origin: "http://localhost:3000",
  methods: ["GET","POST","PUT","DELETE"],  // React’s dev server
  credentials: true  }
));

app.use(express.json());

// session
app.use(
  session({
    secret: "topSecret",
    resave: true,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000
    }
  })
);

// at the URL path /images/<filename>
app.use(
  '/images',
  express.static(path.join(__dirname, 'data', 'phone_default_images'))
);

// MongoDB Connection
const db_uri = process.env.MONGO_URI;
mongoose
  .connect(db_uri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Route to routes/oldPhoneDeals.routes.js
app.use("/api/oldPhoneDeals", oldPhoneDeals);

// Start Server
app.listen(PORT, () => {
 console.log(`Server running on port ${PORT}`);
});