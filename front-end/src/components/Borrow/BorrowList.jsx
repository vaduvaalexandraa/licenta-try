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
    const [reviewText, setReviewText] = useState('');
    const [ratingValue, setRatingValue] = useState(0);

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
                    canExtend: daysBorrowed < 21, // putem să prelungim
                    status: borrow.status
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
        setRatingValue(0); // Reset rating value when opening the return popup
        setShowReturnPopup(true);
    };

    const handleReviewSubmission = async () => {
        try {
            console.log('Rating Value before submission:', ratingValue); // Log the rating value
            const reviewData = {
                idUser: idUser,
                idBook: borrowToReturn.id,
                review: reviewText,
                rating: ratingValue
            };
            console.log('Review Data being submitted:', reviewData);
            //SALVARE REVIEW
            await axios.post('http://localhost:5000/reviews', reviewData);
    
            // Set the new return date to the current date
            const currentDate = new Date();
            const newReturnDate = currentDate.toISOString(); // Format the date as needed
    
            //STATUS CARTE "RETURNED"
            await axios.put(`http://localhost:5000/imprumuturi/status/${borrowToReturn.idImprumut}`, { status: 'returned', dataRestituire: newReturnDate });
    
            //MODIFICARE NR DE CARTI DISPONIBILE
            const bookResponse = await axios.get(`http://localhost:5000/carti/find/${borrowToReturn.id}`);
            let nrExemplareDisponibile = bookResponse.data.nrExemplareDisponibile;
            nrExemplareDisponibile += 1;
            await axios.put(`http://localhost:5000/carti/exemplare/${borrowToReturn.id}`, { nrExemplareDisponibile });
    
            //REFRESH 
            getBorrows();
    
            //INCHIDERE POPUP + RESETARE VARIABILE
            setShowReturnPopup(false);
            setBorrowToReturn(null);
            setReviewText('');
            setRatingValue(0);
    
        } catch (error) {
            console.error('Error saving review or updating status:', error);
        }
    };
    
    
    const handleRatingClick = (value) => {
        console.log('Selected Rating:', value); // Log the selected rating value
        setRatingValue(value); // Update rating value on star click
    };

    return (
        <div className='borrowlist-content'>
            <h2>Împrumuturi</h2>
            {borrowsSpecificDetails.length === 0 ? (
                <p>Nu există împrumuturi disponibile.</p>
            ) : (
                // Sort loans: active first, then returned
                borrowsSpecificDetails
                    .sort((a, b) => (a.status === 'returned' ? 1 : -1))
                    .map(book => (
                        <div className='book-item' key={book.idImprumut} style={{ backgroundColor: book.status === 'returned' ? '#f0f0f0' : '' }}>
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
                                {book.status !== 'returned' && (
                                    <p className="daysleft-p">Au mai rămas <span className={book.daysLeft < 5 ? 'red-text' : 'blue-text'}>{book.daysLeft} </span> zile până la data returului!</p>
                                )}
                                <div className="borrow-buttons-container">
                                    {book.status !== 'returned' && (
                                        <>
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
                                                    <Rating className='give-rating' ratingValue={ratingValue} stars={5} onClick={handleRatingClick} />
                                                    <h4 className='return-h4'>Cum ți s-a părut cartea? Oferă un review: 📝</h4>
                                                    <textarea placeholder="Adaugă un review" value={reviewText} onChange={(e) => setReviewText(e.target.value)} />
                                                    <button className='return-btn-borrow' onClick={handleReviewSubmission}>Restituie!</button>
                                                </div>
                                            </PopUpPrelungire>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
            )}
        </div>
    );
}

export default BorrowList;
