import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PopUpPrelungire from '../PopUpPrelungire/PopUpPrelungire';
import './BorrowList.css';

function BorrowList({ idUser }) {
    const [borrowsSpecificDetails, setBorrowsDetails] = useState([]);
    const [buttonExtendPopup, setButtonExtendPopup] = useState(false);

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

    const extendBorrow = () => {
        setButtonExtendPopup(!buttonExtendPopup);
    }

    return (
        <div className='borrowlist-content'>
            <h2>Împrumuturi</h2>
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
                                    const month = date.getMonth() + 1;
                                    const year = date.getFullYear();
                                    return `${day < 10 ? `0${day}` : day}/${month < 10 ? `0${month}` : month}/${year}`;
                                })()
                            }</p>
                            <p className="daysleft-p">Au mai rămas <span className={book.daysLeft < 5 ? 'red-text' : 'blue-text'}>{book.daysLeft} </span> zile până la data returului!</p>
                            <div className="borrow-buttons-container">
                                <button className="extend-term-button" onClick={extendBorrow}>Prelungeste</button>
                                <PopUpPrelungire trigger={buttonExtendPopup} setTrigger={setButtonExtendPopup}>
                                    <h3>Doriți să prelungiți împrumutul?</h3>
                                    <h4>Imprumutul se poate prelungi cu 7 zile, o singura data!</h4>
                                    <div class="buttons-prel">
                                    <button>Prelungeste!</button>
                                    <button>Anuleaza!</button>
                                    </div>
                                </PopUpPrelungire>
                                <button className="return-button">Restituie</button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default BorrowList;
