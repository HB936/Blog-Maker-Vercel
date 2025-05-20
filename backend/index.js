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

// Remove app.listen and instead export the handler for Vercel
mongoose.connect(
    "mongodb+srv://x4deadshot:hardikbhai92006@cluster0.h7haiys.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
        dbName: "RevoltronX"
    }
).then(() => {
    console.log("Connected to MongoDB");
}).catch(() => {
    console.log("Unable to connect to database");
});

module.exports = server;
