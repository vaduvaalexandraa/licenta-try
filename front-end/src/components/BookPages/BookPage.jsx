import {BsArrowLeftCircleFill, BsArrowRightCircleFill} from "react-icons/bs";
import React, { useState, useEffect,useRef } from "react";
import "./BookPage.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import pages_icon from "../../assets/open-book.png";
import year_icon from "../../assets/calendar.png";
import isbn_icon from "../../assets/bar-code.png";
import genre_icon from "../../assets/literature.png";
import { Rating } from 'react-simple-star-rating';
//adaugate pentru a retine id-ul userului logat
import { UserContext } from "../../Context/UserContext";
import { useContext } from "react";
import PopUp from "../PopUp/PopUp";

function BookPage() {
    //adaugat pentru a retine id-ul userului logat
    const storedUserId = sessionStorage.getItem('userId');
    const { id } = useParams();
    const [carte, setCarte] = useState({});
    const [autorCarte, setAutorCarte] = useState({});
    const [imagesCarte, setImagesCarte] = useState([]);
    const [slide, setSlide] = useState(0);
    const[buttonPopup,setButtonPopup]=useState(false);
    const scrollRef = useRef(null); 

    useEffect(() => {
        fetchSpecificBook();
        window.scrollTo(0, 0);
    }, [id]); // Add id as a dependency

    const fetchSpecificBook = async () => { 
        try {
            const response = await axios.get(`http://localhost:5000/carti/find/${id}`);
            setCarte(response.data);
            fetchAutorCarte(response.data.idAutor); // Fetch author based on book's author ID
            
            if(Array.isArray(response.data.imagineCarte)) {
                const tempImages = []; // Create a temporary array for images
                response.data.imagineCarte.forEach(image => {
                    let imageSpecificBook=`http://localhost:5000/uploads/${image}`;
                    tempImages.push(imageSpecificBook); // Add images to the temporary array
                });
                setImagesCarte(tempImages); // Set the state with the temporary array
            }
        
        } catch (error) {
            console.error('Error fetching book:', error);
        }
    }

    const fetchAutorCarte = async (idAutor) => { // Pass idAutor as an argument
        try {
            const response = await axios.get(`http://localhost:5000/autori/id/${idAutor}`);
            setAutorCarte(response.data);
        } catch (error) {
            console.error('Error fetching author:', error);
        }
    }

    
    const nextSlide=()=>{
        if(slide===imagesCarte.length-1){
            setSlide(0);
        }else{
            setSlide(slide+1);
        }
    }

    const prevSlide=()=>{
        if(slide===0){
            setSlide(imagesCarte.length-1);
        }else{
            setSlide(slide-1);
        }
    }

    const addToWishlist = async () => {
        try {
            // Verificăm mai întâi dacă cartea este deja în lista de dorințe a utilizatorului
            const idC=Number(id);
            const existingWishlistItem = await axios.get(`http://localhost:5000/wishlist/${storedUserId}/${idC}`);
            if (existingWishlistItem.data) {
                console.log(existingWishlistItem.data)
                window.alert("Cartea este deja în wishlist!");
                return; // Ieșim din funcție dacă cartea este deja în listă
            }
            // Dacă cartea nu există încă în lista de dorințe, o adăugăm
            const response = await axios.post('http://localhost:5000/wishlist', {
                idUser: storedUserId,
                idCarte: Number(id)
            });
            window.alert("Cartea a fost adăugată în wishlist!")
            console.log(response.data); // Poți gestiona răspunsul în funcție de necesități
        } catch (error) {
            console.error('Error adding to wishlist:', error);
        }
    }

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
                dataImprumut: currentDate.toISOString(),
                dataRestituire: returnDate.toISOString()
            });

            window.alert("Cartea a fost împrumutată!");
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
                {imagesCarte.map((image, index) => ( <img key={index} src={image} alt="book" 
                className={slide === index ?"slide":"slide slide-hidden"} /> ))} 
                <BsArrowRightCircleFill className="arrow arrow-right" onClick={nextSlide}/>
                <span className="indicators">
                    {imagesCarte.map((_,index)=>{
                        return <button key={index} onClick={()=>setSlide(index)} 
                        className={slide===index?"indicator":"indicator indicator-inactive"}></button>
                    })}
                </span>
            </div>
            </div>
            
            <div className="details-container">
                <div className="specific-book-details">
                    <h1>{carte.titlu}</h1>
                    <h2>Autor: {autorCarte.nume} {autorCarte.prenume}</h2>
                    <Rating className="rating-book"
                        // initialRating={3}
                        readonly/>
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
                    <img src={year_icon } alt="year" className="emoji"/>
                    <div>AN APARITIE</div>
                    <div className="emoji-text">{carte.anulPublicarii}</div>
                </div>
                <div className="input-emoji">
                    <img src={isbn_icon } alt="isbn" className="emoji"/>
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
                <button className="button_lend" onClick={addToBorrowList}>IMPRUMUTA</button>
                <button className="button_wishlist" onClick={addToWishlist}> WISHLIST</button>
                <PopUp trigger={buttonPopup} setTrigger={setButtonPopup} handleConfirm={handleConfirm}>
                    <h3 className="title-lending">Doresti sa plasezi imprumutul?</h3>
                    <p>Locatia de unde va fi disponibil pentru ridicat este: ASE, CSIE </p>
                    <div className="gmap-frame">
                        <iframe width="320" height="300" frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0" src="https://maps.google.com/maps?width=320&amp;height=300&amp;hl=en&amp;q=Academia%20de%20Studii%20Economice,%20Cl%C4%83direa%20Virgil%20Madgearu,%20Calea%20Doroban%C8%9Bi%2015-17,%20Bucure%C8%99ti%20010552+(My%20Business%20Name)&amp;t=p&amp;z=19&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"><a href="https://www.gps.ie/">gps vehicle tracker</a></iframe>
                    </div>
                    <p>Termenul de returnare este: {returnDate.toLocaleDateString()}</p>
                </PopUp>
            </div>
        </div>
       
        
    );
}

export default BookPage;
