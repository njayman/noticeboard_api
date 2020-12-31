//imports
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
//declarations
const { PORT, DBNAME, DBUSER, DBPASSWORD } = process.env;
const app = express();
app.use(express.json())
app.use(cors());

//mongodb connection
mongoose.connect(`mongodb+srv://${DBUSER}:${DBPASSWORD}@njay.iy3to.mongodb.net/${DBNAME}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(error => console.log(error.message))

//route management
const masterRoute = require('./routes/masterRoute')
const noticeboardRoute = require('./routes/noticeboardRoute')
const adminRoute = require('./routes/adminRoute')
app.use('/', noticeboardRoute)
app.use('/admin', adminRoute)
app.use('/master', masterRoute)
//listener
app.listen(PORT, () => console.log("Server is up!"));