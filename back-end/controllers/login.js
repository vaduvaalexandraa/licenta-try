const User = require('../models/User');
const bcrypt=require('bcrypt');
const cookieParser = require('cookie-parser');
// app.use(cookieParser());
const{createToken, validateToken}=require('../middleware/JWT');

const loginUser=async (req,res)=>{
    const{email,password}=req.body;

    const user=await User.findOne({where:{email:email}});

    if(!user){
        res.status(400).json({error:"User doesn't exist!"});
    }

    const dbPassword=user.password;
    bcrypt.compare(password,dbPassword).then((match)=>{
        if(!match){
            res.status(400).json({error:"Wrong email or password!"});
        }
        else {
            const accessToken=createToken(user);
            res.cookie("access-token",accessToken,{
                maxAge:60*60*24*30*1000,
                httpOnly:true,
                
            })
            res.json("Logged in!");}
            
    });
    
};

module.exports={loginUser};