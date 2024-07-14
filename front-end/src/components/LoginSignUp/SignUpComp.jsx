import React, { useState } from "react";
import "./LoginSignUp.css";
import user_icon from "../../assets/person.png";
import password_icon from "../../assets/password.png";
import email_icon from "../../assets/email.png";
import phone_icon from "../../assets/phone.png";
import student_mark_icon from "../../assets/student-mark.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SignUpComp() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        studentMark: '',
        email: '',
        phoneNumber: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const goToLoginPage = () => {
        navigate("/signin");
    };

    const registerUser = async (userData) => {
        try {
            const response = await axios.post("http://localhost:5000/register", userData);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    };

    const validatePassword = (password) => {
        if (password.length < 6) {
            return "Parola trebuie să aibă cel puțin 6 caractere!";
        }
        
        if (!/[A-Z]/.test(password)) {
            return "Parola trebuie să conțină cel puțin o majusculă!";
        }

        if (!/[a-z]/.test(password)) {
            return "Parola trebuie să conțină cel puțin o literă mică!";
        }

        if (!/\d/.test(password)) {
            return "Parola trebuie să conțină cel puțin un caracter numeric!";
        }

        if (!/[!@#$%^&*?]/.test(password)) {
            return "Parola trebuie să conțină cel puțin un caracter special(!@#$%^&*)";
        }

        return null;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        let newErrors = { ...errors };

        if (name === 'firstName' && value.length < 3) {
            newErrors.firstName = "Numele trebuie să aibă minim 3 caractere!";
        } else {
            delete newErrors.firstName;
        }

        if (name === 'lastName' && value.length < 3) {
            newErrors.lastName = "Prenumele trebuie să aibă minim 3 caractere!";
        } else {
            delete newErrors.lastName;
        }

        if (name === 'studentMark') {
            if (value.length !== 9) {
                newErrors.studentMark = "Formatul pentru marca este invalid!";
            } else if (value[0] !== 'S') {
                newErrors.studentMark = "Formatul pentru marca este invalid!";
            } else {
                delete newErrors.studentMark;
            }
        }

        if (name === 'phoneNumber') {
            if (value.length !== 10) {
                newErrors.phoneNumber = "Numărul de telefon trebuie să aibă 10 caractere!";
            } else if (value[0] !== '0' || value[1] !== '7') {
                newErrors.phoneNumber = "Numărul de telefon trebuie să înceapă cu 07!";
            } else {
                delete newErrors.phoneNumber;
            }
        }

        if (name === 'email' && !emailRegex.test(value)) {
            newErrors.email = "Formatul introdus pentru email nu este corect!";
        } else {
            delete newErrors.email;
        }

        if (name === 'password') {
            const passwordError = validatePassword(value);
            if (passwordError) {
                newErrors.password = passwordError;
            } else {
                delete newErrors.password;
            }
        }

        setErrors(newErrors);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const { firstName, lastName, studentMark, email, phoneNumber, password } = formData;

        if (Object.keys(errors).length === 0 && firstName && lastName && studentMark && email && phoneNumber && password) {
            const userData = { firstName, lastName, studentMark, email, phoneNumber, password };
            const response = await registerUser(userData);
            console.log(response);
            setFormData({
                firstName: '',
                lastName: '',
                studentMark: '',
                email: '',
                phoneNumber: '',
                password: ''
            });
            setSuccessMessage("You have successfully registered!");
            setTimeout(() => setSuccessMessage(''), 5000);
            goToLoginPage();
        } else {
            setErrors({ form: "Completeaza toate campurile!" });
        }
    };

    return (
        <div className="container">
            <div className="header-log">
                <div className="text">Inregistrare</div>
                <div className="underline"></div>
            </div>
            <div className="inputs">
                <div className="input">
                    <img src={user_icon} alt="" />
                    <input 
                        type="text" 
                        name="firstName"
                        placeholder="Prenume" 
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                    {errors.firstName && <div className="error">{errors.firstName}</div>}
                </div>

                <div className="input">
                    <img src={user_icon} alt="" />
                    <input 
                        type="text" 
                        name="lastName"
                        placeholder="Nume" 
                        value={formData.lastName}
                        onChange={handleChange}
                    />
                    {errors.lastName && <div className="error">{errors.lastName}</div>}
                </div>
                
                <div className="input">
                    <img src={student_mark_icon} alt="" />
                    <input 
                        type="text" 
                        name="studentMark"
                        placeholder="Marca de student" 
                        value={formData.studentMark}
                        onChange={handleChange}
                    />
                    {errors.studentMark && <div className="error">{errors.studentMark}</div>}
                </div>
                <div className="input">
                    <img src={phone_icon} alt="" />
                    <input 
                        type="text" 
                        name="phoneNumber"
                        placeholder="Numar de telefon" 
                        value={formData.phoneNumber}
                        onChange={handleChange}
                    />
                    {errors.phoneNumber && <div className="error">{errors.phoneNumber}</div>}
                </div>
                <div className="input">
                    <img src={email_icon} alt="" />
                    <input 
                        type="email" 
                        name="email"
                        placeholder="Email" 
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors.email && <div className="error">{errors.email}</div>}
                </div>

                <div className="input">
                    <img src={password_icon} alt="" />
                    <input 
                        type="password" 
                        name="password"
                        placeholder="Parola" 
                        value={formData.password}
                        onChange={handleChange}
                    />
                    {errors.password && <div className="error">{errors.password}</div>}
                </div>
            </div>

            <div className="forgot-password" onClick={goToLoginPage}>
                Ai deja un cont? <span>Autentificare</span>
            </div>
            <div className="submit-container">
                <button className="submit" onClick={handleRegister}>Creeaza cont</button>
            </div>

            {errors.form && <div className="form-error">{errors.form}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
        </div>
    );
}

export default SignUpComp;
