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


function SingUpComp() {

    const navigate = useNavigate()
  
    const goToLoginPage=()=>{
      navigate("/signin");
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;



    const registerUser=async(userData)=>{
        try{
            const response=await axios.post("http://localhost:5000/register",userData);
            return response.data;
        }catch(error){
            console.log(error);}
    };

    const validatePassword = (password) => {
        if (password.length < 6) {
            return "Parola trebuia sa aiba cel putin 6 caractere!";
        }
        
        if (!/[A-Z]/.test(password)) {
            return "Parola trebuie sa contina cel putin o majuscula!";
        }

        if (!/[a-z]/.test(password)) {
            return "Parola trebuie sa contina cel putin o litera mica!";
        }

        if (!/\d/.test(password)) {
            return "Parola trebuie sa contina cel putin un caracter numeric!";
        }

        if (!/[!@#$%^&*?]/.test(password)) {
            return "Parola trebuie sa contina cel putin un caracter special(!@#$%^&*)";
        }

        return null;
    };



    const handleRegister = async () => {
        try {
            const firstName = document.querySelector("input[placeholder='First Name']").value;
            const lastName = document.querySelector("input[placeholder='Last Name']").value;
            const studentMark = document.querySelector("input[placeholder='Student Mark']").value;
            const email = document.querySelector("input[placeholder='Email']").value;
            const phoneNumber = document.querySelector("input[placeholder='Phone Number']").value;
            const password = document.querySelector("input[placeholder='Password']").value;

            // Verificăm dacă numele și prenumele au cel puțin 3 caractere
            if (firstName.length < 3  ) {
                alert("Numele trebuie sa aiba minim 3 caractere!");
                return;
            }

            if(lastName.length < 3){
                alert("Prenumele trebuie sa aiba minim 3 caractere!");
                return;
            }

            // Verificăm lungimea și formatul numărului de telefon
            if (phoneNumber.length !== 10 ) {
                alert("Numarul de telefon trebuie sa aiba 10 caractere!");
                return;
            }

            if(phoneNumber[0] !== '0' || phoneNumber[1] !== '7'){
                alert("Numarul de telefon trebuie sa inceapa cu 07!");
                return;
            }

            if (!emailRegex.test(email)) {
                alert("Formatul introdus pentru email nu este corect!");
                return;
            }

            const passwordError = validatePassword(password);
            if (passwordError) {
                alert(passwordError);
                return;
            }

            if (firstName !== "" && lastName !== "" && studentMark !== "" && email !== "" && phoneNumber !== "" && password !== "") {
                const userData = { firstName, lastName, studentMark, email, phoneNumber, password };
                const response = await registerUser(userData);
                console.log(response);
                document.querySelector("input[placeholder='First Name']").value = "";
                document.querySelector("input[placeholder='Last Name']").value = "";
                document.querySelector("input[placeholder='Student Mark']").value = "";
                document.querySelector("input[placeholder='Email']").value = "";
                document.querySelector("input[placeholder='Phone Number']").value = "";
                document.querySelector("input[placeholder='Password']").value = "";
                window.alert("You have successfully registered!");
                goToLoginPage();
            } else {
                alert("Please fill all the fields!");
            }

        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div className="container">
            <div className="header-log">
                <div className="text">Sign Up</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
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
                <div className="input">
                    <img src={email_icon} alt="" />
                    <input type="email" placeholder="Email"/>
                </div>


                <div className="input">
                    <img src={password_icon} alt="" />
                    <input type="password" placeholder="Password"/>
                </div>

                    </div>
           <div className="forgot-password" onClick={goToLoginPage}>Already have an account? <span>Login</span></div>
            <div className="submit-container">

                <button className="submit" onClick={() => {handleRegister(); }}>Sign Up</button>
            </div>
        </div>
    );
}

export default SingUpComp;