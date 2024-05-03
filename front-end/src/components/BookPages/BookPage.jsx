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

function BookPage() {
    const { id } = useParams();
    const [carte, setCarte] = useState({});
    const [autorCarte, setAutorCarte] = useState({});
    const [imagesCarte, setImagesCarte] = useState([]);
    const [slide, setSlide] = useState(0);
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

    const [active, setActive] = useState(false)

    

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
                        initialRating={3}
                        readonly
                    />
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
                <button className="button_lend">IMPRUMUTA</button>
                <button className="button_wishlist"> WISHLIST</button>
            </div>

        </div>
       
        
    );
}

export default BookPage;
