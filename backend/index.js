const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const BlogsRouter = require('./routers/BlogsRouter');

const server = express();
server.use(express.json());

server.use(cors({
  origin: ['http://localhost:5173']
}));

server.use('/api/blog', BlogsRouter);

// A variable to hold the connected server
let isConnected = false;

// Middleware to block requests until MongoDB is connected
server.use((req, res, next) => {
  if (!isConnected) {
    return res.status(500).send({ msg: "MongoDB not connected", status: 0 });
  }
  next();
});

mongoose.connect(
  "mongodb+srv://x4deadshot:mongodbpassword@cluster0.h7haiys.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  {
    dbName: "RevoltronX"
  }
).then(() => {
  console.log("Connected to MongoDB Atlas");
  isConnected = true;
}).catch((err) => {
  console.error("MongoDB connection error:", err);
  isConnected = false;
});

module.exports = server;
