import React from "react";
import "./LoginSignUp.css";
import user_icon from "../../assets/person.png";
import password_icon from "../../assets/password.png";
import email_icon from "../../assets/email.png";
import phone_icon from "../../assets/phone.png";
import student_mark_icon from "../../assets/student-mark.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

function LoginSignUp() {
    const navigate = useNavigate()
  
    const goToHomePage=()=>{
      navigate("/home");
    }
    const goToRegisterPage=()=>{
        navigate("/signup");
      }

    const loginUser=async(userData)=>{
        try{
            const response=await axios.post("http://localhost:5000/login",userData);
            return response.data;
        }catch(error){
            console.log(error);
    }
    };

    const handleLogin=async()=>{
        try{
                if(document.querySelector("input[placeholder='Email']").value!==""&&
                document.querySelector("input[placeholder='Password']").value!==""){
                    const email=document.querySelector("input[placeholder='Email']").value;
                    const password=document.querySelector("input[placeholder='Password']").value;
                    const userData={email,password};
                    const response=await loginUser(userData);
                    console.log(response);
                    document.querySelector("input[placeholder='Email']").value="";
                    document.querySelector("input[placeholder='Password']").value="";
                    if(response==="Logged in!"){  
                        window.alert("You have successfully logged in!");
                        goToHomePage();
                    }else{
                        window.alert("Invalid credentials!");
                    }
            }else{
                alert("Please fill all the fields!");
            }
        
        }catch(error){
            console.log(error);}
    }
    

    return(

        <div className="container">
            <div className="header-log">
                <div className="text">Sign In</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                <div className="input">
                    <img src={email_icon} alt="" />
                    <input type="email" placeholder="Email"/>
                </div>


                <div className="input">
                    <img src={password_icon} alt="" />
                    <input type="password" placeholder="Password"/>
                </div>
            </div>
            <div className="forgot-password">Forgot Password? <span>Click here!</span></div>
            <div className="forgot-password" onClick={() => { goToRegisterPage(); }}>Don't have an account?<span> Register here!</span></div>
            <div className="submit-container">
                <button className="submit" onClick={() => { handleLogin(); }}>Sign In</button>
            </div>
        </div>
    );}

export default LoginSignUp;