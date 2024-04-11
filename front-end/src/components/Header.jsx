import React, {useState} from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.css';
import logo from '../assets/logo2.png';

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    return(
        <nav>
            <Link to="/" className='header' ><img src={logo} alt="logo-platforma" className='logo_platforma'></img></Link>
            <div className='menu' onClick={()=>{
                setMenuOpen(!menuOpen);
                console.log(menuOpen);
            }}>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <ul className={menuOpen ? "openMenu" :""}>
                <li><NavLink to="/profile">Profile</NavLink></li>
                <li><NavLink to="/signin">Sign In</NavLink></li>
                <li><NavLink to="/signup">Sign Up</NavLink></li>
                <li><NavLink to="/addBook">Add Book</NavLink></li>
                
            </ul>
        </nav>
    );
}

export default Header;