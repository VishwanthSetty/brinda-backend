const express = require('express')
const app = express();
const mongoose = require('mongoose');
const bodyParse = require('body-parser');
const cors = require('cors')
const loginRoutes = require('./routes/login/auth')
require('dotenv/config')

const PORT = process.env.PORT || 3000;
app.use(cors())
app.use(bodyParse.json());
app.get('/',(req,res)=>{
    res.send("hello workd");
})
app.use('/auth',loginRoutes)
app.get('/home',(req,res)=>{
    res.send("this is home");
})
mongoose.connect(
    process.env.DB_CONNECTION,
    err=>{
        if(err){
            console.log(err)
        }
        else console.log("DB Connected")
    }
)
app.listen(PORT,()=>{
    console.log("Server is Starting at port "+ PORT +" ......")
});