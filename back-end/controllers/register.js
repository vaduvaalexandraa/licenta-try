const User = require('../models/User');
const bcrypt=require('bcrypt');
const sendMail=require("../functions/mail_confirm");

const registerUser=(req,res)=>{
    const {firstName,lastName,studentMark,email,phoneNumber,password}=req.body;
    bcrypt.hash(password,10).then((hash)=>{
        User.create({
            firstName:firstName,
            lastName:lastName,
            studentMark:studentMark,
            email:email,
            phoneNumber:phoneNumber,
            password:hash,
        }).then((user)=>{
            sendMail(email);
            res.json("Succesfully registered!");

    }).catch((err)=>{
        if(err){
            res.status(400).json({error:err});
        }
    });
});
};

module.exports={registerUser};