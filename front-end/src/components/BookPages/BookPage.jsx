import {BsArrowLeftCircleFill, BsArrowRightCircleFill} from "react-icons/bs";
import React, { useState, useEffect } from "react";
import "./BookPage.css";
import axios from "axios";
import { useParams } from "react-router-dom";


function BookPage() {
    const { id } = useParams();
    const [carte, setCarte] = useState({});
    const [autorCarte, setAutorCarte] = useState({});
    const [imagesCarte, setImagesCarte] = useState([]);
    const [slide, setSlide] = useState(0);

    useEffect(() => {
        fetchSpecificBook();
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

    

    return (
        <div className="book-details">
            <div className="carousel-container">
            <div className="carousel">
                <BsArrowLeftCircleFill className="arrow arrow-left" onClick={prevSlide}/>
                {imagesCarte.map((image, index) => ( <img key={index} src={image} alt="book" 
                className={slide === index ?"slide":"slide slide-hidden"} /> ))} 
                <BsArrowRightCircleFill className="arrow arrow-right" onClick={nextSlide}/>
                <span className="indicators">
                    {imagesCarte.map((_,index)=>{
                        return <button key={index} onClick={null} 
                        className={slide===index?"indicator":"indicator indicator-inactive"}></button>
                    })}
                </span>
            </div>
            </div>
            
            <div className="details-container">
            <div className="specific-book-details">
            <h1>{carte.titlu}</h1>
            <h3>Gen literar: {carte.genLiterar}</h3>
            <h4>Autor: {autorCarte.nume} {autorCarte.prenume}</h4> {/* Use + instead of +""+ */}
            <p>{carte.descriere}</p>
            </div>
            </div>
            
        </div>
        
    );
}

export default BookPage;
