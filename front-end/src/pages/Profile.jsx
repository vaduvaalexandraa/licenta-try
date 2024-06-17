import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';
import { useNavigate } from 'react-router-dom';
import PopUpPrelungire from '../components/PopUpPrelungire/PopUpPrelungire';

function Profile() {
    const navigate = useNavigate();
    const idUser = sessionStorage.getItem('userId');
    const [wishlistBooks, setWishlistBooks] = useState([]);
    const [wishlistOpen, setWishlistOpen] = useState(false);
    const [imprumuturiOpen, setImprumuturiOpen] = useState(false);
    const [profilOpen, setProfilOpen] = useState(false);
    const [specificUserDataProfile, setSpecificUserDataProfile] = useState({});
    const [borrows, setBorrows] = useState([]);
    const [borrowsSpecificDetails, setBorrowsDetails] = useState([]);
    const [buttonExtendPopup, setButtonExtendPopup] = useState(false);

    useEffect(() => {
        getBorrows();
        wishlistData();
        getSpecificUserDataProfile();
    }, []);

    const getSpecificUserDataProfile = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/users/${idUser}`);
            setSpecificUserDataProfile(response.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }

    const getBorrows = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/imprumuturi/${idUser}`);
            setBorrows(response.data);
            borrowsDetails(response.data); // Pass the data directly
        } catch (error) {
            console.error('Error fetching borrows:', error);
        }
    }

    const borrowsDetails = async (borrowsData) => {
        try {
            const booksDetails = await Promise.all(borrowsData.map(async borrow => {
                const bookResponse = await axios.get(`http://localhost:5000/carti/find/${borrow.ISBNcarte}`);
                const authorResponse = await axios.get(`http://localhost:5000/autori/id/${bookResponse.data.idAutor}`);
                const daysLeft = Math.floor((new Date(borrow.dataRestituire) - new Date()) / (1000 * 60 * 60 * 24)) + 1;
                return {
                    ...bookResponse.data,
                    authorName: `${authorResponse.data.nume} ${authorResponse.data.prenume}`,
                    returnData: borrow.dataRestituire,
                    borrowStartDate: borrow.dataImprumut,
                    daysLeft: daysLeft
                };
            }));
            setBorrowsDetails(booksDetails);
        } catch (error) {
            console.error('Error fetching borrows details:', error);
        }
    }

    const wishlistData = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/wishlist/${idUser}`);
            const booksIds = response.data.map(book => book.idCarte);
            const booksDetails = await Promise.all(booksIds.map(async id => {
                const bookResponse = await axios.get(`http://localhost:5000/carti/find/${id}`);
                const authorResponse = await axios.get(`http://localhost:5000/autori/id/${bookResponse.data.idAutor}`);
                const bookDetails = {
                    ...bookResponse.data,
                    authorName: `${authorResponse.data.nume} ${authorResponse.data.prenume}`
                };
                return bookDetails;
            }));
            setWishlistBooks(booksDetails);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        }
    }

    const removeBookFromWishlist = async (bookId) => {
        try {
            await axios.delete(`http://localhost:5000/wishlist/${idUser}/${bookId}`);
            wishlistData();
        } catch (error) {
            console.error('Error removing book from wishlist:', error);
        }
    }

    const handleClickWishBook = async (bookId) => {
        navigate(`/carte/${bookId}`);
    }

    const toggleWishlist = () => {
        setWishlistOpen(!wishlistOpen);
        setImprumuturiOpen(false); // Dacă se deschide wishlist-ul, închide și secțiunea de împrumuturi
        setProfilOpen(false); // Dacă se deschide wishlist-ul, închide și secțiunea de profil
    }

    const toggleImprumuturi = () => {
        setImprumuturiOpen(!imprumuturiOpen);
        setWishlistOpen(false); // Dacă se deschide secțiunea de împrumuturi, închide și wishlist-ul
        setProfilOpen(false); // Dacă se deschide secțiunea de împrumuturi, închide și secțiunea de profil
    }

    const toggleProfil = () => {
        setProfilOpen(!profilOpen);
        setWishlistOpen(false); // Dacă se deschide secțiunea de profil, închide și wishlist-ul
        setImprumuturiOpen(false); // Dacă se deschide secțiunea de profil, închide și secțiunea de împrumuturi
    }

    const extendBorrow = () => {
        setButtonExtendPopup(!buttonExtendPopup); // Inversează starea curentă a popup-ului
    }

    return (
        <div className="profile-container">
            <div className="left-panel">
                <h1>PROFIL UTILIZATOR</h1>
                <h2>{specificUserDataProfile.firstName} {specificUserDataProfile.lastName}</h2>
                <ul>
                    <li className={wishlistOpen ? 'active' : ''} onClick={toggleWishlist}>Wishlist</li>
                    <li className={imprumuturiOpen ? 'active' : ''} onClick={toggleImprumuturi}>Imprumuturi</li>
                    <li className={profilOpen ? 'active' : ''} onClick={toggleProfil}>Editeaza profil</li>
                </ul>
            </div>

            <div className="wishlist-content">
                {wishlistOpen && (
                    <div>
                        <h2>Wishlist</h2>
                        {wishlistBooks.map(book => (
                            <div className='book-item' key={book.id} onClick={() => handleClickWishBook(book.id)}>
                                <div className='book-image'>
                                    <img src={`http://localhost:5000/uploads/${book.imagineCarte[0]}`} alt="book" style={{ width: '100px' }} />
                                </div>
                                <div key={book.id} className='book-details-wishlist'>
                                    <p>{book.titlu}</p>
                                    <p>autor: {book.authorName}</p>
                                    <p>gen: {book.genLiterar.toUpperCase()}</p>
                                    <p>an publicare: {book.anulPublicarii}</p>
                                    <button className="remove-button" onClick={() => removeBookFromWishlist(book.id)}>Elimina</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {imprumuturiOpen && (
                    <div className='borrowlist-content'>
                        <h2>Imprumuturi</h2>
                        {borrowsSpecificDetails.length === 0 ? (
                            <p>Nu există împrumuturi disponibile.</p>
                        ) : (
                            borrowsSpecificDetails.map(book => (
                                <div className='book-item' key={book.id}>
                                    <div className='book-image'>
                                        <img src={`http://localhost:5000/uploads/${book.imagineCarte[0]}`} alt="book" style={{ width: '100px' }} />
                                    </div>
                                    <div className='book-details-wishlist'>
                                        <p>{book.titlu}</p>
                                        <p>Autor: {book.authorName}</p>
                                        <p>Data restituire: {
                                            (() => {
                                                const date = new Date(book.returnData);
                                                const day = date.getDate();
                                                const month = date.getMonth() + 1; // Months are 0-based
                                                const year = date.getFullYear();
                                                return `${day < 10 ? `0${day}` : day}/${month < 10 ? `0${month}` : month}/${year}`;
                                            })()
                                        }</p>
                                        <p className="daysleft-p">Au mai rămas <span className={book.daysLeft < 5 ? 'red-text' : 'blue-text'}>{book.daysLeft} </span> zile până la data returului!</p>
                                        <div className="borrow-buttons-container">
                                            <button className="extend-term-button" onClick={() => extendBorrow()}>Prelungeste </button>
                                            <PopUpPrelungire trigger={buttonExtendPopup} setTrigger={setButtonExtendPopup}>
                                                {/* Aici poți adăuga conținutul specific al popup-ului */}
                                                <h3>Conținutul popup-ului</h3>
                                            </PopUpPrelungire>
                                            <button className="return-button">Restituie</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {profilOpen && (
                    <div>
                        <h2>Editeaza profil</h2>
                        <p>În curând...</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Profile;
