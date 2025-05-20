const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const BlogsRouter = require('./routers/BlogsRouter');

const server = express();
server.use(express.json());

server.use(cors({
    origin: ['http://localhost:5173']
}))

server.use('/api/blog', BlogsRouter);


mongoose.connect(
    "mongodb://127.0.0.1:27017/",
    {
        dbName: "RevoltronX"
    }
).then(
    () => {
        server.listen(
            5000,
            () => console.log('Server Started')
        )
    }
).catch(
    () => {
        console.log("Unable to connect to database"); 
    }
)