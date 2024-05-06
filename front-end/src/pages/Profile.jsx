import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';

function Profile() {
    const idUser = sessionStorage.getItem('userId');
    const [wishlistBooks, setWishlistBooks] = useState([]);

    useEffect(() => {
        wishlistData();
    }, []);

    const wishlistData = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/wishlist/${idUser}`);
            const booksIds = response.data.map(book => book.idCarte);
            const booksDetails = await Promise.all(booksIds.map(async id => {
                const bookResponse = await axios.get(`http://localhost:5000/carti/find/${id}`);
                const authorResponse = await axios.get(`http://localhost:5000/autori/id/${bookResponse.data.idAutor}`);
                const bookDetails = { ...bookResponse.data, authorName: `${authorResponse.data.nume} ${authorResponse.data.prenume}` };
                return bookDetails;
            }));
            setWishlistBooks(booksDetails);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        }
    }

    return (
        <div>
            <h1>Profile</h1>
            <p>Information about you will be displayed here in the future!</p>
            <p>Wishlist: </p>
            {wishlistBooks.map(book => (
                <div className='book-item' key={book.id}>
                <div className='book-image'>
                <img src={`http://localhost:5000/uploads/${book.imagineCarte[0]}`} alt="book" style={{width: '100px'}}/>
                </div>
                <div key={book.id} className='book-details-wishlist'>
                    <p>{book.titlu}</p>
                    <p>{book.authorName}</p>
                </div>
                </div>
            ))}
        </div>
    )
}

export default Profile;
