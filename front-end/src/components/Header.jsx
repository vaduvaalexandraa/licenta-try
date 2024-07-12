import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';
import logo from '../assets/logo2.png';
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import axios from 'axios';

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const idUser = sessionStorage.getItem('userId');
    const [role, setRole] = useState('user');

    const navigate = useNavigate();

    const goHome=()=>{
        navigate("/");
        window.location.reload();
    }

    const handleLogout = () => {
        sessionStorage.removeItem('userId');
        // Alte acțiuni de delogare necesare
        window.location.reload();
        goHome();
    };

    const getRole = async() => {
        try{
            const response = await axios.get(`http://localhost:5000/users/${idUser}`);
            if(response.data.role==='admin'){
                setRole(response.data.role);
            }
        }catch(error){
            console.error('Error fetching user:', error);
        }
    }

    useEffect(() => {
        getRole();
    }, []);


    const homeRoute = idUser ? "/home" : "/";

    return(
        <nav>
            <div className='header'>
                <NavLink to={homeRoute} >
                    <img src={logo} alt="logo-platforma" className='logo_platforma' />
                </NavLink>
                <div className='menu' onClick={()=>{
                    setMenuOpen(!menuOpen);
                    console.log(menuOpen);
                }}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            <ul className={menuOpen ? "openMenu" :""}>
                {idUser ? (
                    <>
                        <li><NavLink to="/profile">Profil</NavLink></li>
                        {role === 'admin' ? (
                            <li><NavLink to="/admin">Admin</NavLink></li>
                        ) : null}
                        <li><NavLink to="/contact">Contact</NavLink></li>
                        <li onClick={handleLogout}><a href="#">Deconectare</a></li>
                        
                    </>
                ) : (
                    <>
                        
                        <li><NavLink to="/signin">Conectare</NavLink></li>
                        <li><NavLink to="/signup">Inregistrare</NavLink></li>
                        <li><NavLink to="/contact">Contact</NavLink></li>
                    </>
                )}
                
                
            </ul>
        </nav>
    );
}

export default Header;
