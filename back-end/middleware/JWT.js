const {sign, verify}=require('jsonwebtoken');

const createToken=(user)=>{
    const accessToken=sign({email:user.email,id:user.id},"jwtsecret");
    return accessToken;
}

const validateToken=(req,res,next)=>{
    const accessToken=req.cookies["access-token"];
    if(!accessToken){
        return res.status(400).json({error:"User not authenticated!"});
    }

    try{
        const validToken = verify(accessToken,"jwtsecret");
        if(validToken){
            req.authenticated=true;//var pt a verifica daca userul este autentificat
            return next();
        }
    } catch(err){
        return res.status(400).json({error:err});
    }
}

module.exports={createToken, validateToken};