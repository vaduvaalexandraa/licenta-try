import React from "react";
import "./LoginSignUp.css";
import user_icon from "../../assets/person.png";
import password_icon from "../../assets/password.png";
import email_icon from "../../assets/email.png";
import phone_icon from "../../assets/phone.png";
import student_mark_icon from "../../assets/student-mark.png";
import { useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
//adaugat pentru a retine id-ul userului logat
import { UserContext } from "../../Context/UserContext";


function LoginSignUp() {
    
    const navigate = useNavigate()
  
    const goToHomePage=()=>{
      navigate("/home");
      window.location.reload();
    }
    const goToRegisterPage=()=>{
        navigate("/signup");
      }

      const loginUser = async (userData) => {
        try {
            const response = await axios.post("http://localhost:5000/login", userData);
            return { data: response.data, error: null };
        } catch (error) {
            console.log(error);
            return { data: null, error: error.response ? error.response.data.error : "An error occurred" };
        }
    };
    
    const handleLogin = async () => {
        try {
            if (document.querySelector("input[placeholder='Email']").value !== "" &&
                document.querySelector("input[placeholder='Password']").value !== "") {
                const email = document.querySelector("input[placeholder='Email']").value;
                const password = document.querySelector("input[placeholder='Password']").value;
                const userData = { email, password };
                const { data, error } = await loginUser(userData);
    
                document.querySelector("input[placeholder='Email']").value = "";
                document.querySelector("input[placeholder='Password']").value = "";
    
                if (error) {
                    window.alert(error); // Display error message
                } else if (data && data.message === "Logged in!") {
                    sessionStorage.setItem("userId", data.userId);
                    window.alert("You have successfully logged in!");
                    goToHomePage();
                } else {
                    window.alert("Invalid credentials!");
                }
            } else {
                alert("Please fill all the fields!");
            }
        } catch (error) {
            console.log(error);
        }
    };
    

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