import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs";
import React, { useState, useEffect, useRef } from "react";
import "./BookPage.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import pages_icon from "../../assets/open-book.png";
import year_icon from "../../assets/calendar.png";
import isbn_icon from "../../assets/bar-code.png";
import genre_icon from "../../assets/literature.png";
import { Rating } from 'react-simple-star-rating';
import { UserContext } from "../../Context/UserContext";
import { useContext } from "react";
import PopUp from "../PopUp/PopUp";
import PopUpPrelungire from "../PopUpPrelungire/PopUpPrelungire";

function BookPage() {
    const storedUserId = sessionStorage.getItem('userId');
    const { id } = useParams();
    const [carte, setCarte] = useState({});
    const [autorCarte, setAutorCarte] = useState({});
    const [imagesCarte, setImagesCarte] = useState([]);
    const [slide, setSlide] = useState(0);
    const [buttonPopup, setButtonPopup] = useState(false);
    const [isBorrowDisabled, setIsBorrowDisabled] = useState(false);
    const scrollRef = useRef(null);
    const [rating, setRating] = useState(0); // State pentru rating
    const [reviewsLength, setReviewsLength] = useState(0); // State pentru numărul de review-uri
    const [showReviewsPopup, setShowReviewsPopup] = useState(false);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        fetchSpecificBook();
        fetchReviews(); // Fetch reviews on component mount
        window.scrollTo(0, 0);
    }, [id]);

    const fetchReviews = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/reviews/book/${id}`);
            const reviewsWithUserData = response.data.map(async review => {
                const userDataResponse = await axios.get(`http://localhost:5000/users/${review.idUser}`);
                return {
                    ...review,
                    userData: userDataResponse.data
                };
            });
    
            const reviewsWithData = await Promise.all(reviewsWithUserData);
            setReviews(reviewsWithData);
    
            const averageRating = reviewsWithData.reduce((acc, curr) => acc + curr.rating, 0) / reviewsWithData.length;
            setRating(averageRating);
            setReviewsLength(reviewsWithData.length);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };
    
    
    

    const fetchSpecificBook = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/carti/find/${id}`);
            setCarte(response.data);
            setIsBorrowDisabled(response.data.nrExemplareDisponibile <= 0);
            fetchAutorCarte(response.data.idAutor);
            if (Array.isArray(response.data.imagineCarte)) {
                const tempImages = response.data.imagineCarte.map(image => `http://localhost:5000/uploads/${image}`);
                setImagesCarte(tempImages);
            }
        } catch (error) {
            console.error('Error fetching book:', error);
        }
    };

    const fetchAutorCarte = async (idAutor) => {
        try {
            const response = await axios.get(`http://localhost:5000/autori/id/${idAutor}`);
            setAutorCarte(response.data);
        } catch (error) {
            console.error('Error fetching author:', error);
        }
    };

    const nextSlide = () => {
        if (slide === imagesCarte.length - 1) {
            setSlide(0);
        } else {
            setSlide(slide + 1);
        }
    };

    const prevSlide = () => {
        if (slide === 0) {
            setSlide(imagesCarte.length - 1);
        } else {
            setSlide(slide - 1);
        }
    };

    const addToWishlist = async () => {
        try {
            const idC = Number(id);
            const existingWishlistItem = await axios.get(`http://localhost:5000/wishlist/${storedUserId}/${idC}`);
            if (existingWishlistItem.data) {
                window.alert("Cartea este deja în wishlist!");
                return;
            }
            const response = await axios.post('http://localhost:5000/wishlist', {
                idUser: storedUserId,
                idCarte: Number(id)
            });
            window.alert("Cartea a fost adăugată în wishlist!");
            console.log(response.data);
        } catch (error) {
            console.error('Error adding to wishlist:', error);
        }
    };

    const currentDate = new Date();
    const returnDate = new Date();
    returnDate.setDate(currentDate.getDate() + 14);

    const addToBorrowList = async () => {
        try {
            const idC = Number(id);
            const existingBorrowItem = await axios.get(`http://localhost:5000/imprumuturi/${storedUserId}/${idC}`);
            if (existingBorrowItem.data) {
                window.alert("Cartea este deja imprumutata!");
                return;
            }
            setButtonPopup(true);
        } catch (error) {
            console.error('Error checking borrow list:', error);
        }
    };

    const handleConfirm = async () => {
        try {
            const idC = Number(id);
            const response = await axios.post('http://localhost:5000/imprumuturi', {
                idUser: storedUserId,
                ISBNcarte: idC,
                dataImprumut: currentDate.toISOString().split('T')[0],
                dataRestituire: returnDate.toISOString().split('T')[0]
            });

            if (response.data.message === 'No copies available') {
                window.alert('No copies available for borrowing!');
                setIsBorrowDisabled(true);
            } else {
                window.alert("Cartea a fost împrumutată!");
                await axios.put(`http://localhost:5000/carti/exemplare/${id}`, {
                    nrExemplareDisponibile: carte.nrExemplareDisponibile - 1
                });
                setIsBorrowDisabled(carte.nrExemplareDisponibile - 1 <= 0);
                setCarte(prevState => ({
                    ...prevState,
                    nrExemplareDisponibile: prevState.nrExemplareDisponibile - 1
                }));
            }
        } catch (error) {
            console.error('Error adding to borrow list:', error);
        }
        setButtonPopup(false);
    };

    return (
        <div className="big-div">
            <div className="book-details">
                <div className="carousel-container">
                    <div className="carousel">
                        <BsArrowLeftCircleFill className="arrow arrow-left" onClick={prevSlide}/>
                        {imagesCarte.map((image, index) => (
                            <img key={index} src={image} alt="book" className={slide === index ? "slide" : "slide slide-hidden"} />
                        ))}
                        <BsArrowRightCircleFill className="arrow arrow-right" onClick={nextSlide}/>
                        <span className="indicators">
                            {imagesCarte.map((_, index) => (
                                <button key={index} onClick={() => setSlide(index)}
                                    className={slide === index ? "indicator" : "indicator indicator-inactive"}>
                                </button>
                            ))}
                        </span>
                    </div>
                </div>

                <div className="details-container">
                    <div className="specific-book-details">
                        <h1>{carte.titlu}</h1>
                        <h2>Autor: {autorCarte.nume} {autorCarte.prenume}</h2>
                        <div className="rating-and-reviews">
                            <Rating className="rating-book" initialValue={rating} stars={5} readonly/>
                            <p className="reviews-count" onClick={() => setShowReviewsPopup(true)}> ({reviewsLength}) review-uri</p>
                            <PopUpPrelungire trigger={showReviewsPopup} setTrigger={setShowReviewsPopup}>
                            <h3 className="review-title">Review-uri</h3>
                            <ul className="list-review">
                                {reviews.map((review, index) => (
                                    <li key={index}>
                                        <div className="review-header">
                                            
                                            <Rating className="rating-book" initialValue={review.rating} stars={5} readonly/>
                                            <p><strong>👤User:</strong> <em>{review.userData.lastName} {review.userData.firstName}</em></p>
                                            <p><strong>🖊️Recenzie:</strong> {review.review}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                             </PopUpPrelungire>

                        </div>
                        <h3>DESCRIERE</h3>
                        <div className="book-description">
                            {carte.descriere && carte.descriere.split('.').map((sentence, index, array) => (
                                <div key={index} className="description-sentence">{sentence.trim()}{index !== array.length - 1 && '.'}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="emoji-div">
                <div className="input-emoji">
                    <img src={pages_icon} alt="pages" className="emoji"/>
                    <div>PAGINI</div>
                    <div className="emoji-text">{carte.numarPagini}</div>
                </div>
                <div className="input-emoji">
                    <img src={year_icon} alt="year" className="emoji"/>
                    <div>AN APARITIE</div>
                    <div className="emoji-text">{carte.anulPublicarii}</div>
                </div>
                <div className="input-emoji">
                    <img src={isbn_icon} alt="isbn" className="emoji"/>
                    <div>ISBN</div>
                    <div className="emoji-text">{carte.ISBN}</div>
                </div>
                <div className="input-emoji">
                    <img src={genre_icon} alt="genre" className="emoji"/>
                    <div>GEN</div>
                    <div className="emoji-text">{carte.genLiterar}</div>
                </div>
            </div>

            <div className="button-book">
                <button className="button_lend" onClick={addToBorrowList} disabled={isBorrowDisabled}>IMPRUMUTA</button>
                <button className="button_wishlist" onClick={addToWishlist}>WISHLIST</button>
                <PopUp trigger={buttonPopup} setTrigger={setButtonPopup} handleConfirm={handleConfirm}>
                    <h3 className="title-lending">Doresti sa plasezi imprumutul?</h3>
                    <p>Locatia de unde va fi disponibil pentru ridicat este: ASE, CSIE</p>
                    <div className="gmap-frame">
                        <iframe width="320" height="300" frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0"
                            src="https://maps.google.com/maps?width=320&amp;height=300&amp;hl=en&amp;q=Academia%20de%20Studii%20Economice,%20Cl%C4%83direa%20Virgil%20Madgearu,%20Calea%20Doroban%C8%9Bi%2015-17,%20Bucure%C8%99ti%20010552+(My%20Business%20Name)&amp;t=p&amp;z=19&amp;ie=UTF8&amp;iwloc=B&amp;output=embed">
                        </iframe>
                    </div>
                    <p>Termenul de returnare este: {returnDate.toLocaleDateString()}</p>
                </PopUp>
            </div>
        </div>
    );
}

export default BookPage;
