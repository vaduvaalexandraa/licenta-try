import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  
import './BookSuggestions.css'; 

function Suggestion() {
    const [suggestions, setSuggestions] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [loans, setLoans] = useState([]);
    const [allBooks, setAllBooks] = useState([]);
    const [loansBookDetails, setLoansBookDetails] = useState([]);
    const idUser = sessionStorage.getItem('userId');
    const navigate = useNavigate();

    useEffect(() => {
        fetchWishlistAndLoans();
    }, [idUser]);

    useEffect(() => {
        if (wishlist.length > 0 || loans.length > 0 || allBooks.length > 0) {
            generateSuggestions();
        }
    }, [wishlist, loans, allBooks]);

    const fetchWishlistAndLoans = async () => {
        try {
            const wishlistResponse = await axios.get(`http://localhost:5000/wishlist/${idUser}`);
            const loansResponse = await axios.get(`http://localhost:5000/imprumuturi/${idUser}`);
            setWishlist(wishlistResponse.data);
            setLoans(loansResponse.data);
        } catch (error) {
            console.error('Error fetching wishlist and loans:', error);
        }
    };

    const fetchAllBooks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/carti');
            setAllBooks(response.data);
        } catch (error) {
            console.error('Error fetching all books:', error);
        }
    };

    const generateSuggestions = async () => {
        try {
            const loansBookIds = loans.map(book => book.ISBNcarte);
            const loansBookDetailsArray = [];
    
            for (let i = 0; i < loansBookIds.length; i++) {
                const id = loansBookIds[i];
                const response = await axios.get(`http://localhost:5000/carti/find/${id}`);
                loansBookDetailsArray.push(response.data);
            }
    
            setLoansBookDetails(loansBookDetailsArray);
    
            if (allBooks.length === 0) {
                await fetchAllBooks();
            }
    
            const loansGenres = loansBookDetailsArray.map(book => book.genLiterar);
            const suggestedBooks = allBooks.filter(book => loansGenres.includes(book.genLiterar));
            const filteredSuggestions = suggestedBooks.filter(suggestion => {
                return !loansBookDetailsArray.some(loansBook => loansBook.ISBN === suggestion.ISBN);
            });
    
            setSuggestions(filteredSuggestions);
        } catch (error) {
            console.error('Error generating suggestions:', error);
        }
    };

    const handleClickWishBook = (bookId) => {
        navigate(`/carte/${bookId}`);
    };

    return (
        <div className="suggestions">
            {loansBookDetails.length > 0 && (
                <div className="loaned-books">
                    <h2>Pentru că ai citit cartile:</h2>
                    {loansBookDetails.map(book => (
                        <div key={book.ISBN} className="loaned-book" onClick={() => handleClickWishBook(book.id)}>
                            {book.imagineCarte?.[0] && (
                                <img src={`http://localhost:5000/uploads/${book.imagineCarte[0]}`} alt={book.titlu} style={{ width: '120px' }} />
                            )}
                            <div>
                                <p>{book.titlu}</p>
                                <p>Gen: {book.genLiterar}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {suggestions.length > 0 && (
                <ul className="book-suggestions">
                    <h2>Iti recomandăm si:</h2>
                    {suggestions.map(suggestion => (
                        <li key={suggestion.ISBN} className='suggested-book' onClick={() => handleClickWishBook(suggestion.id)}>
                            {suggestion.imagineCarte?.[0] && (
                                <img src={`http://localhost:5000/uploads/${suggestion.imagineCarte[0]}`} alt={suggestion.titlu} style={{ width: '120px' }} />
                            )}
                            <div>
                                <p>{suggestion.titlu}</p>
                                <p>Gen: {suggestion.genLiterar}</p>
                                <p>An aparitie: {suggestion.anulPublicarii}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {suggestions.length === 0 && loans.length === 0 && (
                <p>Momentan nu avem sugestii pentru tine.</p>
            )}
        </div>
    );
}

export default Suggestion;
