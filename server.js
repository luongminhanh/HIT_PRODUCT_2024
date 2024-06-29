require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/hit-2024';

app.get('/', (req, res) => {
    res.send("<h1>Hello World</h1>");
})

mongoose
    .connect(mongoURI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .then(() => {
        app.listen(port, () => {
            console.log((`Server is running at http://localhost:${port}`));
        })
    })
    .catch((err) => {0
        console.log(err);
    })
