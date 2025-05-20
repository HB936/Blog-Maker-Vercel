const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const BlogsRouter = require('./routers/BlogsRouter');

const server = express();
server.use(express.json());

server.use(cors({
    origin: ['https://blog-maker-vercel.vercel.app']
}));

server.use('/api/blog', BlogsRouter);

// Remove app.listen and instead export the handler for Vercel
mongoose.connect(
    "mongodb+srv://x4deadshot:mongodbpassword@cluster0.h7haiys.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
        dbName: "RevoltronX"
    }
).then(() => {
    console.log("Connected to MongoDB");
}).catch(() => {
    console.log("Unable to connect to database");
});

module.exports = server;
