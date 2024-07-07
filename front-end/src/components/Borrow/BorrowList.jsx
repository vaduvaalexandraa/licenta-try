import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PopUpPrelungire from '../PopUpPrelungire/PopUpPrelungire';
import './BorrowList.css';
import { Rating } from 'react-simple-star-rating';

function BorrowList({ idUser }) {
    const [borrowsSpecificDetails, setBorrowsDetails] = useState([]);
    const [buttonExtendPopup, setButtonExtendPopup] = useState(false);
    const [borrowToExtend, setBorrowToExtend] = useState(null);

    const [showReturnPopup, setShowReturnPopup] = useState(false);
    const [borrowToReturn, setBorrowToReturn] = useState(null);

    useEffect(() => {
        getBorrows();
    }, []);

    const getBorrows = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/imprumuturi/${idUser}`);
            borrowsDetails(response.data);
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
                const daysBorrowed = Math.floor((new Date(borrow.dataRestituire) - new Date(borrow.dataImprumut)) / (1000 * 60 * 60 * 24));
                return {
                    ...bookResponse.data,
                    authorName: `${authorResponse.data.nume} ${authorResponse.data.prenume}`,
                    returnData: borrow.dataRestituire,
                    borrowStartDate: borrow.dataImprumut,
                    daysLeft: daysLeft,
                    idImprumut: borrow.id, 
                    canExtend: daysBorrowed < 21 // putem sa prelungim
                };
            }));
            setBorrowsDetails(booksDetails);
        } catch (error) {
            console.error('Error fetching borrows details:', error);
        }
    }

    const extendBorrow = (book) => {
        setBorrowToExtend(book);
        setButtonExtendPopup(true);
    }

    const extendDaysBorrow = async () => {
        try {
            const newReturnDate = new Date(borrowToExtend.returnData);
            newReturnDate.setDate(newReturnDate.getDate() + 7);
            await axios.put(`http://localhost:5000/imprumuturi/${borrowToExtend.idImprumut}`, { dataRestituire: newReturnDate });

            // Update the state to reflect the extension
            setBorrowsDetails(prevDetails =>
                prevDetails.map(book =>
                    book.idImprumut === borrowToExtend.idImprumut
                        ? { ...book, returnData: newReturnDate, daysLeft: book.daysLeft + 7, canExtend: false }
                        : book
                )
            );

            // Close the popup and reset the current borrow
            setButtonExtendPopup(false);
            setBorrowToExtend(null);
        } catch (error) {
            console.error('Error extending borrow:', error);
        }
    }

    const showReturnForm = (borrow) => {
        setBorrowToReturn(borrow);
        setShowReturnPopup(true);
    };

    return (
        <div className='borrowlist-content'>
            <h2>Împrumuturi</h2>
            {borrowsSpecificDetails.length === 0 ? (
                <p>Nu există împrumuturi disponibile.</p>
            ) : (
                borrowsSpecificDetails.map(book => (
                    <div className='book-item' key={book.idImprumut}>
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
                                    const month = date.getMonth() + 1;
                                    const year = date.getFullYear();
                                    return `${day < 10 ? `0${day}` : day}/${month < 10 ? `0${month}` : month}/${year}`;
                                })()
                            }</p>
                            <p className="daysleft-p">Au mai rămas <span className={book.daysLeft < 5 ? 'red-text' : 'blue-text'}>{book.daysLeft} </span> zile până la data returului!</p>
                            <div className="borrow-buttons-container">
                                <button 
                                    className="extend-term-button" 
                                    onClick={() => extendBorrow(book)}
                                    disabled={!book.canExtend}
                                    style={{ backgroundColor: !book.canExtend ? 'grey' : '' }}
                                >
                                    Prelungeste
                                </button>
                                <PopUpPrelungire trigger={buttonExtendPopup} setTrigger={setButtonExtendPopup}>
                                    <h3>Doriți să prelungiți împrumutul?</h3>
                                    <h4 className='extend-h4'>Imprumutul se poate prelungi cu 7 zile, o singura data!</h4>
                                    <div className="buttons-prel">
                                        <button className='extend-btn-borrow' onClick={extendDaysBorrow}>Prelungeste!</button>
                                        <button className='cancel-btn-borrow' onClick={() => setButtonExtendPopup(false)}>Anuleaza!</button>
                                    </div>
                                </PopUpPrelungire>
                                <button className="return-button" onClick={() => showReturnForm(book)}>Restituie</button>
                                <PopUpPrelungire trigger={showReturnPopup} setTrigger={setShowReturnPopup}>
                                    <div className="return-popup">
                                    <h3>Doriți să restituiți cartea?</h3>
                                    <h4 className='return-h4'>Ofera un numar de stele bazat pe experienta avuta!⭐</h4>
                                    <Rating className='give-rating' ratingValue={0} stars={5} />
                                    <h4 className='return-h4'>Cum ti s-a parut cartea? Ofera un review: 📝</h4>
                                    <textarea placeholder="Adauga un review"  />
                                    <button className='return-btn-borrow' onClick={() => setShowReturnPopup(false)}>Restituie!</button>
                                    </div>
                                </PopUpPrelungire>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default BorrowList;
