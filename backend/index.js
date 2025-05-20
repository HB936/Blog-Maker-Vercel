const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const BlogsRouter = require('./routers/BlogsRouter');

const server = express();

// Middleware
server.use(express.json());
server.use(cors({
  origin: ['https://blog-maker-vercel.vercel.app'] // Add your frontend domain if needed
}));

// MongoDB connection string directly in code (not recommended for production but will work)
const MONGODB_URI = "mongodb+srv://x4deadshot:mongodbpassword@cluster0.h7haiys.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connection function
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "RevoltronX"
    });
    console.log("Connected to MongoDB Atlas");
    return true;
  } catch (err) {
    console.error("MongoDB connection error:", err);
    return false;
  }
};

// Health check route
server.get('/api/health', (req, res) => {
  res.status(200).send({
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Connection handling middleware - tries to connect before handling requests
server.use('/api/blog', async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    const connected = await connectToMongoDB();
    if (!connected) {
      return res.status(500).send({ msg: "MongoDB not connected", status: 0 });
    }
  }
  next();
}, BlogsRouter);

// Initial connection attempt
connectToMongoDB();

// For local development
const PORT = 3000;
if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export for Vercel
module.exports = server;
