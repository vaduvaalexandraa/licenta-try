import React, { useEffect, useState } from 'react';
import './Home.css';
import CardList from '../components/BookCard/CardList';
import axios from 'axios';

function Home() {
    const genuri=["drama","poezie","roman","nuvela","epopee","eseu","jurnal","memorialistica","publicistica","biografie",
    "autobiografie","corespondenta","critica","teatru","scenariu","fantasy","altele"]

    const [books, setBooks] = useState([]);
    const [minValue, setMinValue] = useState(25);
    const [maxValue, setMaxValue] = useState(75);
    const [minInputValue, setMinInputValue] = useState(1900);
    const [maxInputValue, setMaxInputValue] = useState(2021);

    const handleMinInputChange = (e) => {
        setMinInputValue(e.target.value);
    };

    const handleMaxInputChange = (e) => {
        setMaxInputValue(e.target.value);
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/carti');
            const bookData = response.data;
            const booksWithAuthors = await Promise.all(bookData.map(async (book) => {
                const authorResponse = await axios.get(`http://localhost:5000/autori/${book.idAutor}`);
                const authorData = authorResponse.data;
                const imaginee = book.imagineCarte[0];
                return {
                    ...book,
                    autor: authorData.nume + ' ' + authorData.prenume,
                    // Modificare aici: utilizează ruta din backend pentru a accesa imaginile
                    image: `http://localhost:5000/uploads/${imaginee}`
                };
            }));

            setBooks(booksWithAuthors);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    return (
        <div className='homepage'>
            <div className='container-filter'>
                <h1>Cautare avansata</h1>
                <p>Genuri literare</p>
                <select className='filter'>
                    {genuri.map((gen, index) => (
                        <option key={index} value={gen}>{gen}</option>
                    ))}
                </select>
                <p>Anul publicarii</p>
                <div className='slider'>
                    <input type="range" min="1900" max="2021" value={minInputValue} className='min-range' onChange={handleMinInputChange} />
                    <input type="text" className='filter-min' value={minInputValue} readOnly />
                    <input type="range" min="1900" max="2021" value={maxInputValue} className='max-range' onChange={handleMaxInputChange} />
                    <input type="text" className='filter-max' value={maxInputValue} readOnly />
                </div>
                <p>Autor</p>
                <input type="text" className='filter'></input>
                <button className="learn-more">Aplica filtre</button>
            </div>
            <div className='container-list'>
                <CardList books={books} />
            </div>
        </div>
    );
}

export default Home;
