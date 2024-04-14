import React from "react";
import Card from "./Card";
import './CardList.css';

function CardList({books}) {
return(
    <div className="container-books">
        {books.map((book, index) => (
            <Card key={index} image={book.image} titlu={book.titlu} autor={book.autor} descriere={book.descriere}/>
        ))}
    </div>
);
}

export default CardList;