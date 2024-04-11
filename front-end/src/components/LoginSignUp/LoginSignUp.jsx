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

const[action,setAction]=useState("Sign In");

    const navigate = useNavigate()
  
    const goToHomePage=()=>{
      navigate("/");
    }



const registerUser=async(userData)=>{
    try{
        const response=await axios.post("http://localhost:5000/register",userData);
        return response.data;
    }catch(error){
        console.log(error);}
};

const loginUser=async(userData)=>{
    try{
        const response=await axios.post("http://localhost:5000/login",userData);
        return response.data;
    }catch(error){
        console.log(error);
}
};

const handleRegister=async()=>{
    try{
        if(action==="Sign Up"){
            const firstName=document.querySelector("input[placeholder='First Name']").value;
            const lastName=document.querySelector("input[placeholder='Last Name']").value;
            const studentMark=document.querySelector("input[placeholder='Student Mark']").value;
            const email=document.querySelector("input[placeholder='Email']").value;
            const phoneNumber=document.querySelector("input[placeholder='Phone Number']").value;
            const password=document.querySelector("input[placeholder='Password']").value;
            if(firstName!==""&&lastName!==""&&studentMark!==""&&email!==""&&phoneNumber!==""&&password!==""){
                const userData={firstName,lastName,studentMark,email,phoneNumber,password};
                const response=await registerUser(userData);
                console.log(response);
                document.querySelector("input[placeholder='First Name']").value="";
                document.querySelector("input[placeholder='Last Name']").value="";
                document.querySelector("input[placeholder='Student Mark']").value="";
                document.querySelector("input[placeholder='Email']").value="";
                document.querySelector("input[placeholder='Phone Number']").value="";
                document.querySelector("input[placeholder='Password']").value="";
            window.alert("You have successfully registered!");
        }else{
        alert("Please fill all the fields!");
        }
    }
    }catch(error){
        console.log(error);}
}

const handleLogin=async()=>{
    try{
        if(action==="Sign In")
        {
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
    }
    }catch(error){
        console.log(error);}
}

   

    return (
        <div className="container">
            <div className="header-log">
                <div className="text">{action}</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                {action==="Sign In"?<div></div >:<div className="inputs">
                <div className="input">
                    <img src={user_icon} alt="" />
                    <input type="text" placeholder="First Name"/>
                </div>

                <div className="input">
                    <img src={user_icon} alt="" />
                    <input type="text" placeholder="Last Name"/>
                </div>
                
                <div className="input">
                    <img src={student_mark_icon} alt="" />
                    <input type="text" placeholder="Student Mark"/>
                </div>
                <div className="input">
                    <img src={phone_icon} alt="" />
                    <input type="text" placeholder="Phone Number"/>
                </div>
                    </div>}

            

                <div className="input">
                    <img src={email_icon} alt="" />
                    <input type="email" placeholder="Email"/>
                </div>


                <div className="input">
                    <img src={password_icon} alt="" />
                    <input type="password" placeholder="Password"/>
                </div>
            </div>
            {action==="Sign Up"?<div></div>: <div className="forgot-password">Forgot Password? <span>Click here!</span></div>}
           
            <div className="submit-container">


                <button className={action === "Sign In"?"submit gray":"submit"} onClick={() => { setAction("Sign Up"); handleRegister(); }}>Sign Up</button>
                <button className={action === "Sign Up"?"submit gray":"submit"} onClick={() => { setAction("Sign In"); handleLogin(); }}>Sign In</button>
            </div>
        </div>
    );
}

export default LoginSignUp;