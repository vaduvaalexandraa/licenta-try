import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditBook.css';
import PopUpPrelungire from '../PopUpPrelungire/PopUpPrelungire';
import genuri from '../../list-components';

function EditBook() {
    const [dataBaseBooks, setDataBaseBooks] = useState([]);
    const [buttonDeleteBookPopup, setButtonDeleteBookPopup] = useState(false);
    const [buttonEditBookPopup, setButtonEditBookPopup] = useState(false);
    const [bookToEditId, setBookToEditId] = useState(null);
    const [bookToDeleteId, setBookToDeleteId] = useState(null); 
    const [bookDetails, setBookDetails] = useState({
        ISBN: '',
        titlu: '',
        genLiterar: '',
        anulPublicarii: '',
        numarPagini: '',
        descriere: ''
    });

    const getDatabaseBooks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/carti');
            const booksIds = response.data.map(book => book.id);
            const booksDetails = await Promise.all(booksIds.map(async id => {
                const bookResponse = await axios.get(`http://localhost:5000/carti/find/${id}`);
                const authorResponse = await axios.get(`http://localhost:5000/autori/id/${bookResponse.data.idAutor}`);
                const bookDetails = {
                    ...bookResponse.data,
                    authorName: `${authorResponse.data.nume} ${authorResponse.data.prenume}`
                };
                return bookDetails;
            }));
            setDataBaseBooks(booksDetails);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    }

    const fetchBookDetails = async (id) => {
        try {
            const bookResponse = await axios.get(`http://localhost:5000/carti/find/${id}`);
            setBookDetails({
                ISBN: bookResponse.data.ISBN,
                titlu: bookResponse.data.titlu,
                genLiterar: bookResponse.data.genLiterar,
                anulPublicarii: bookResponse.data.anulPublicarii,
                numarPagini: bookResponse.data.numarPagini,
                descriere: bookResponse.data.descriere
            });
            setBookToEditId(id);
            setButtonEditBookPopup(true);
        } catch (error) {
            console.error('Error fetching book details:', error);
        }
    }
    

    const handleDeleteClick = (id) => {
        setBookToDeleteId(id);
        setButtonDeleteBookPopup(true);
    }

    const deleteBook = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/carti/${id}`);
            await axios.delete(`http://localhost:5000/wishlist/${id}`);
            // Refresh books after deletion
            getDatabaseBooks();
            // Close the delete confirmation popup
            setButtonDeleteBookPopup(false);
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        if(!bookDetails.ISBN || !bookDetails.titlu || !bookDetails.genLiterar || !bookDetails.anulPublicarii || !bookDetails.numarPagini || !bookDetails.descriere) 
        {
            alert('Toate câmpurile sunt obligatorii!');
            return;
        }
        try {
            await axios.put(`http://localhost:5000/carti/${bookToEditId}`, bookDetails);
            getDatabaseBooks();
            setButtonEditBookPopup(false);
        } catch (error) {
            console.error('Eroare la editarea cărții:', error);
        }
    }
    

    useEffect(() => {
        getDatabaseBooks();
    }, []);

    return (
        <div className='edit-book-container'>
            <h1>Editare carte ✍🏻</h1>
            <div className='edit-book-list'>
                {dataBaseBooks.map((book, index) => (
                    <div key={index} className='edit-book-item'>
                        <div className='book-image'>
                            <img src={`http://localhost:5000/uploads/${book.imagineCarte[0]}`} alt="book" />
                        </div>
                        <div className='book-details'>
                            <h3>{book.titlu}</h3>
                            <p>Autor: {book.authorName}</p>
                            <p>Gen: {book.genLiterar}</p>
                            <p>An aparitie: {book.anulPublicarii}</p>
                        </div>
                        <div className='book-actions'>
                            <button className='edit-button' onClick={() => fetchBookDetails(book.id)}>Editeaza</button>
                            <button className='delete-button' onClick={() => handleDeleteClick(book.id)}>Sterge</button>
                            <PopUpPrelungire trigger={buttonDeleteBookPopup} setTrigger={setButtonDeleteBookPopup}>
                                <h3>Ești sigur că vrei să ștergi această carte?</h3>
                                <div className="buttons-prel">
                                    <button className='delete-button' onClick={() => deleteBook(bookToDeleteId)}>Șterge</button>
                                    <button className='edit-button' onClick={() => setButtonDeleteBookPopup(false)}>Anulează</button>
                                </div>
                            </PopUpPrelungire>
                            <PopUpPrelungire trigger={buttonEditBookPopup} setTrigger={setButtonEditBookPopup}>
                                
                                <form className='edit-book-form' onSubmit={handleSubmit}>
                                    <h3>Editare carte 📝</h3>

                                    <label className='edit-book-label'>🔢ISBN:</label>
                                    <input className='edit-book-input' type="text" value={bookDetails.ISBN} onChange={e =>setBookDetails({...bookDetails, ISBN: e.target.value})} />
                                    <label className='edit-book-label'>📃Titlu:</label>
                                    <input className='edit-book-input' type="text" value={bookDetails.titlu} onChange={e => setBookDetails({ ...bookDetails, titlu: e.target.value })} />
                                    <label className='edit-book-label'>📚 Gen literar:</label>
                                    <select className='edit-book-input' value={bookDetails.genLiterar} onChange={e => setBookDetails({ ...bookDetails, genLiterar: e.target.value })}>
                                        <option value="">Alege genul literar</option>
                                        {genuri.map((gen, index) => (
                                            <option key={index} value={gen}>{gen}</option>
                                        ))}
                                    </select>
                                    <label className='edit-book-label'>🗓️Anul publicării:</label>
                                    <input className='edit-book-input' type="number" value={bookDetails.anulPublicarii} onChange={e => setBookDetails({ ...bookDetails, anulPublicarii: e.target.value })} />
                                    <label className='edit-book-label'>📑Număr pagini:</label>
                                    <input className='edit-book-input' type="number" value={bookDetails.numarPagini} onChange={e => setBookDetails({ ...bookDetails, numarPagini: e.target.value })} />
                                    <label className='edit-book-label'>✒️Descriere:</label>
                                    <textarea className='edit-book-textarea' value={bookDetails.descriere} onChange={e => setBookDetails({ ...bookDetails, descriere: e.target.value })} />
                                    <div className="buttons-prel">
                                        <button type="submit" className='edit-button' onClick={handleSubmit}>Salvează</button>
                                        <button type="button" className='delete-button' onClick={() => setButtonEditBookPopup(false)}>Anulează</button>
                                    </div>
                                </form>
                            </PopUpPrelungire>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default EditBook;
