import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';
import logo from '../assets/logo2.png';

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const idUser = sessionStorage.getItem('userId');

    const handleLogout = () => {
        sessionStorage.removeItem('userId');
        // Alte acțiuni de delogare necesare
        window.location.reload();
    };

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
                        <li><NavLink to="/profile">Profile</NavLink></li>
                        <li onClick={handleLogout}><a href="#">Logout</a></li>
                    </>
                ) : (
                    <>
                        <li><NavLink to="/profile">Profile</NavLink></li>
                        <li><NavLink to="/signin">Sign In</NavLink></li>
                        <li><NavLink to="/signup">Sign Up</NavLink></li>
                    </>
                )}
                <li><NavLink to="/addBook">Add Book</NavLink></li>
            </ul>
        </nav>
    );
}

export default Header;
