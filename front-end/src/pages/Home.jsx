import React, { useState,useEffect } from 'react';
import './Home.css';
import CardList from '../components/BookCard/CardList';
import Card from '../components/BookCard/Card';
import axios from 'axios';

function Home() {
    const [carti, setCarti] = useState([]);

    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    useEffect(() => {
        fetchBooks();
    }, []);

    const genuri=["drama","poezie","roman","nuvela","epopee","eseu","jurnal","memorialistica","publicistica","biografie",
    "autobiografie","corespondenta","critica","teatru","scenariu","fantasy","altele"]

    const[gen, setGen]=useState('');
    const[autor,setAutor]=useState('');

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



    const fetchBooks = async () => {
        try {
            const responseD = await axios.get('http://localhost:5000/carti');
            const bookData = responseD.data;
            const booksWithAuthors = await Promise.all(bookData.map(async (book) => {
                const authorResponse = await axios.get(`http://localhost:5000/autori/id/${book.idAutor}`);
                const authorData = authorResponse.data;
                const imaginee = book.imagineCarte[0];
                return {
                    ...book,
                    autor: authorData.nume + ' ' + authorData.prenume,
                    // Modificare aici: utilizează ruta din backend pentru a accesa imaginile
                    image: `http://localhost:5000/uploads/find/${imaginee}`
                };
            }));
    
            setBooks(booksWithAuthors);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    const handleFilter = async () => {
        try {
            const response = await axios.get('http://localhost:5000/carti');
            const bookData = response.data;
            const booksWithAuthors = await Promise.all(bookData.map(async (book) => {
                const authorResponse = await axios.get(`http://localhost:5000/autori/id/${book.idAutor}`);
                const authorData = authorResponse.data;
                const imaginee = book.imagineCarte[0];
                return {
                    ...book,
                    autor: authorData.nume + ' ' + authorData.prenume,
                    // Modificare aici: utilizează ruta din backend pentru a accesa imaginile
                    image: `http://localhost:5000/uploads/find/${imaginee}`
                };
            }));
    
            let filteredBooks = booksWithAuthors;
            if (gen) {
                filteredBooks = filteredBooks.filter(book => book.genLiterar === gen);
            }

            if(maxInputValue){
                filteredBooks=filteredBooks.filter(book=>book.anulPublicarii<=maxInputValue);
            }
            if(minInputValue){
                filteredBooks=filteredBooks.filter(book=>book.anulPublicarii>=minInputValue);
            }

            if(maxInputValue && minInputValue){
                filteredBooks=filteredBooks.filter(book=>book.anulPublicarii>=minInputValue && book.anulPublicarii<=maxInputValue);
            }

            // if(autor){
            //     const autorr=axios.get(`http://localhost:5000/autori/${autor}`);
            //     filteredBooks=filteredBooks.filter(book=>book.idAutor===autorr.id);
            // }

    
            // Actualizarea listei de cărți afișate
            setBooks(filteredBooks);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    }
    
    

    return (
        <div className='homepage'>
            <div className='container-filter'>
                <h1>Cautare avansata</h1>

                <p>Genuri literare</p>
                <select value={gen} onChange={(e)=>setGen(e.target.value)}>
                <option value="">Selecteaza gen</option>
                    {genuri.map((gen, index) => (
                        <option key={gen} value={gen}>{gen}</option>
                    ))}
                </select>

                <p>Anul publicarii</p>
                <div className='slider'>
                    <input type="range" min="1800" max="2024" value={minInputValue} className='min-range' onChange={handleMinInputChange} />
                    <input type="text" className='filter-min' value={minInputValue} readOnly />
                    <input type="range" min="1800" max="2024" value={maxInputValue} className='max-range' onChange={handleMaxInputChange} />
                    <input type="text" className='filter-max' value={maxInputValue} readOnly />
                </div>

                <p>Autor</p>
                <input type="text" value={autor} onChange={(e)=>setAutor(e.target.value)}></input>

                <button className="learn-more" onClick={handleFilter}>Aplica filtre</button>
            </div>
            <div className='container-list'>
                <CardList books={books} />
            </div>
        </div>
    );
}

export default Home;