const express = require('express');
const { stat } = require('fs');
const router = express.Router();
const jwt = require('jsonwebtoken')
const User = require('../../models/auth/users.model')


function verifyToken(req,res,next){
    if(!req.headers.authorization){
        return res.status(401).send("unauthorized Request")
    }
    let token = req.headers.authorization.split(' ')[1];
    if(token ==''){
        return res.status(401).send("unauthorized Request")
    }
    let payload = jwt.verify(token,'secretKey')
    if(!payload){
        return res.status(401).send(JSON.stringify("unauthorized Request"))
    }
    req.userId = payload.subject;
    next()
}
async function verifyAdmin(req,res,next){
    if(!req.headers.authorization){
        return res.status(401).send(JSON.stringify("unauthorized Request"))
    }
    let token = req.headers.authorization.split(' ')[1];
    if(token ==''){
        return res.status(401).send(JSON.stringify("unauthorized Request"))
    }
    let payload = jwt.verify(token,'secretKey')
    if(!payload){
        return res.status(401).send(JSON.stringify("unauthorized Request"))
    }
    req.userId = payload.subject;
    console.log(req.userId)
    let user = await User.findOne({
        _id:payload.subject
    }).lean()
    if(user.role.includes('admin')){
        next();
    }
    else{
        return res.status(401).send(JSON.stringify("unauthorized Request"))
    }
}   

router.get('/getUser',async (req,res)=>{
    console.log(req.headers.authorization)
    if(!req.headers.authorization){
        return res.status(401).send(JSON.stringify("unauthorized Request"))
    }
    
    let token = req.headers.authorization.split(' ')[1];
    let payload = jwt.verify(token,'secretKey')
    if(!payload){
        return res.status(401).send(JSON.stringify("unauthorized Request"))
    }
    let userId = payload.subject;
    console.log(userId)
    const checkDocument = await User.findOne({
        _id:userId
    })
    res.status(200).send(checkDocument)
})

router.get('/getAllUsers',verifyAdmin,async (req,res)=>{
    let allUsers = await User.find().select(["-password"]).lean();
    res.status(200).send(allUsers)
})
router.get('/changeRole',verifyToken,async (req,res)=>{
    let userId = req.query.id;
    let status = req.query.status
    console.log()
    let user = await User.findOne({
        _id:userId,
    })
    console.log(status)
    console.log(user)
    if(user){
        if(status == 'Active'){
            user.role=['user']
        }
        else{
            user.role=[]
        }
        console.log(user)
        await user.save()
        res.status(200).send(JSON.stringify("Updated Status"))
    }
    else{
        res.status(404).send(JSON.stringify("Updated Status"))
    }
})
router.get('/',(req,res)=>{
    console.log('/');
    res.send("login");
})
router.post('/register',verifyAdmin,async (req,res)=>{
    console.log(req.body);
    let userData = req.body;
    console.log(userData)
    if(userData["role"]){
        if(userData["role"]=="Active"){
            userData["role"] = ['user'];
        }
        else{
            userData["role"] = [];
        }
    }
    
    const checkDocument = await User.findOne({
        email:userData.email
    })
    if(checkDocument){
        res.status(401).send(JSON.stringify("Already exsists"))
    }
    userData['password'] = passwordGen();
    const document = await new User(userData);
    console.log(document);
    
    await document.save();
    res.status(200).send(JSON.stringify("Sussces"));
}) 
router.post('/login',async (req,res)=>{
    let userData = req.body;
    console.log(userData)
    const document = await User.findOne({
        username:userData.userName,
        password:userData.password,
    })
    if(document){
        let payload = {subject:document._id}
        let token = jwt.sign(payload,'secretKey')
        data = {
            token:token,
            user:document
        }
        res.status(200).send(data)
    }
    else{
        res.status(401).send("No user Found or invalid Password");
    }
});

function passwordGen(){
    let pass = 1234;
    return pass;
}

module.exports = router 


