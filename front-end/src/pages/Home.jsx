import React, { useState,useEffect } from 'react';
import './Home.css';
import CardList from '../components/BookCard/CardList';
import Card from '../components/BookCard/Card';
import axios from 'axios';



function Home() {

    const [carti, setCarti] = useState([]);

    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [autori, setAutori] = useState([]);
    const[sortCriteria, setSortCriteria]=useState('');

    

    
    useEffect(() => {
        fetchBooks();
        fetchAuthors();
    }, []);

    const genuri=["drama","poezie","roman","nuvela","epopee","eseu","jurnal","memorialistica","publicistica","biografie",
    "autobiografie","corespondenta","critica","teatru","scenariu","fantasy","psihologie","altele","istorie"]

    const[gen, setGen]=useState('');
    const[autor,setAutor]=useState('');

    const [minValue, setMinValue] = useState(25);
    const [maxValue, setMaxValue] = useState(75);
    const [minInputValue, setMinInputValue] = useState(1800);
    const [maxInputValue, setMaxInputValue] = useState(2024);

    const fetchAuthors = async () => {
        try {
            const response = await axios.get('http://localhost:5000/autori');
            setAutori(response.data);
        } catch (error) {
            console.error('Error fetching authors:', error);
        }
    };

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
                    image: `http://localhost:5000/uploads/find/${imaginee}`
                };
            }));
    
            let filteredBooks = booksWithAuthors;
    
            // Verifică dacă este selectat un singur filtru
            if (gen && !maxInputValue && !minInputValue && !autor) {
                filteredBooks = filteredBooks.filter(book => book.genLiterar === gen);
            } else if (!gen && maxInputValue && minInputValue && !autor) { // Verifică dacă este selectat doar filtrul pentru anul publicării
                filteredBooks = filteredBooks.filter(book => 
                    book.anulPublicarii >= minInputValue && 
                    book.anulPublicarii <= maxInputValue
                );
            } else if (gen && maxInputValue && minInputValue && !autor) { // Verifică dacă sunt selectate ambele filtre
                filteredBooks = filteredBooks.filter(book => 
                    book.genLiterar === gen &&
                    book.anulPublicarii >= minInputValue && 
                    book.anulPublicarii <= maxInputValue
                );
            } else if (autor && !gen && !maxInputValue && !minInputValue) { // Verifică dacă este selectat doar filtrul pentru autor
                filteredBooks = filteredBooks.filter(book => book.idAutor === autor);
            } else if (autor && gen && !maxInputValue && !minInputValue) { // Verifică dacă sunt selectate filtrele pentru autor și gen
                filteredBooks = filteredBooks.filter(book => 
                    book.idAutor === autor &&
                    book.genLiterar === gen
                );
            } else if (autor && maxInputValue && minInputValue && !gen) { // Verifică dacă sunt selectate filtrele pentru autor și anul publicării
                filteredBooks = filteredBooks.filter(book => 
                    book.idAutor === autor &&
                    book.anulPublicarii >= minInputValue && 
                    book.anulPublicarii <= maxInputValue
                );
            } else if (gen && maxInputValue && minInputValue && autor) { // Verifică dacă sunt selectate toate filtrele
                filteredBooks = filteredBooks.filter(book => 
                    book.genLiterar === gen &&
                    book.idAutor === autor &&
                    book.anulPublicarii >= minInputValue && 
                    book.anulPublicarii <= maxInputValue
                );
            } // Alte cazuri pot fi adăugate pentru combinarea altor filtre

            if(sortCriteria==='an_asc'){
                filteredBooks.sort((a,b)=>a.anulPublicarii-b.anulPublicarii);
            }
            if(sortCriteria==='an_desc'){
                filteredBooks.sort((a,b)=>b.anulPublicarii-a.anulPublicarii);
            }
            if(sortCriteria==='literaAsc'){
                filteredBooks.sort((a,b)=>a.titlu.localeCompare(b.titlu));
            }
            if(sortCriteria==='literaDesc'){
                filteredBooks.sort((a,b)=>b.titlu.localeCompare(a.titlu));
            }
    
            // Actualizează lista de cărți afișate
            setBooks(filteredBooks);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    }
    
    
    

    return (
        <div className='homepage'>
            <div className='home-container-filter'>
                <h2 className='titluuu'>Cautare avansata</h2>

                <p>Genuri literare</p>
                <select value={gen} onChange={(e) => setGen(e.target.value)} >
                <option value="">Selecteaza gen</option>
                {genuri.sort().map((gen, index) => (
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
                <select value={autor} onChange={(e) => setAutor(e.target.value)}>
                <option value="">Selectează autor</option>
                {autori.map((author, index) => (
                    <option key={index} value={author.id}>{author.nume} {author.prenume}</option>
                ))}
                </select>


                <button className="learn-more" onClick={handleFilter}>Aplica filtre</button>

                <h3 className='titluu-sortare'>Sorteaza</h3>
                
                <div>
                <input type="checkbox" id="an_asc" value="an_asc" onChange={(e) => setSortCriteria(e.target.value)} />
                <label htmlFor="an_asc">An publicare ascendent</label>
                </div>
                <div>
                    <input type="checkbox" id="an_desc" value="an_desc" onChange={(e) => setSortCriteria(e.target.value)} />
                    <label htmlFor="an_desc">An publicare descendent</label>
                </div>
                <div>
                    <input type="checkbox" id="literaAsc" value="literaAsc" onChange={(e) => setSortCriteria(e.target.value)} />
                    <label htmlFor="literaAsc">Alfabetic (ascendent)</label>
                </div>
                <div>
                    <input type="checkbox" id="literaDesc" value="literaDesc" onChange={(e) => setSortCriteria(e.target.value)} />
                    <label htmlFor="literaDesc">Alfabetic (descendent)</label>
                </div>

            </div>
            <div className='home-container-list'>
                <CardList books={books} />
                {/* <Card image="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg" titlu="Titlu carte" autor="Autor carte" descriere="Descriere carte" />
                <Card image="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg" titlu="Titlu carte" autor="Autor carte" descriere="Descriere carte" /> */}

            </div>
        </div>
    );
}

export default Home;