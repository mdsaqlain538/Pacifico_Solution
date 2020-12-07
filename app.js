require('dotenv').config();
//Functional Requirments 
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');


//Middle ware..
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//My Routes
const authRoutes = require('./routes/auth');


//Env Port
const port = process.env.PORT || 1519;

//MongoDB connection..
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE, 
{useNewUrlParser: true, 
useUnifiedTopology: true,
useCreateIndex:true
}).then(()=>{
    console.log("DB CONNECTED");
});

//Routes Entry.. 
app.use('/api',authRoutes);

app.listen(port, () => {
  console.log(`Pacifico app listening at http://localhost:${port}`)
})