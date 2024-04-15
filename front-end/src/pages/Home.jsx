import React, { useEffect, useState } from 'react';
import './Home.css';
import CardList from '../components/BookCard/CardList';
import axios from 'axios';

function Home() {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const response = await axios.get('http://localhost:5000/carti');
            const data = response.data;
            const booksWithAuthors = await Promise.all(data.map(async (book) => {
                const authorResponse = await axios.get(`http://localhost:5000/autori/${book.idAutor}`);
                const authorData = authorResponse.data;
                const imaginee = book.imagineCarte[0];
                console.log(imaginee);
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
        <div className='container-list'>
            <CardList books={books} />
        </div>
    );
}

export default Home;
