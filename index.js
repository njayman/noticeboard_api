//imports
const express = require('express');
const mongoose = require('mongoose')

//declarations
const { PORT, DBNAME, DBUSER, DBPASSWORD } = process.env;
const app = express();

//mongodb connection
mongoose.connect(`mongodb+srv://${DBUSER}:${DBPASSWORD}@njay.iy3to.mongodb.net/${DBNAME}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(error => console.log(error.message))

//route management
const noticeboardRoute = require('./routes/noticeboardRoute')
app.use('/api', noticeboardRoute)

//listener
app.listen(PORT, () => console.log("Server is up!"));