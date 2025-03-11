const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const routes = require("./routes/index");
require('dotenv').config();
const cors = require("cors");


const mongoURI = process.env.MONGO_URI
const port = process.env.PORT || 3009

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
})
    .then(() => {
        console.log("Database connected successfully");
    })
    .catch((err) => {
        console.error("Database connection error:", err);
    });


app.use(routes);


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
