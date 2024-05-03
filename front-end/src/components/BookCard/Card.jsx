import React from 'react';
import './Card.css';
import { useNavigate } from 'react-router-dom';

function Card(props) {
    const { id, image, titlu, autor, descriere} = props;
    const truncatedDescriere = descriere.substring(0, 230);
    const displayDescriere = descriere.length > 200 ? `${truncatedDescriere}...` : truncatedDescriere;
    const navigate = useNavigate();

    const handleClickCard = () => {
        console.log(`Card ${id} clicked`);
        navigate(`/carte/${id}`);
    };

    return (
        <div className="card-holder" onClick={handleClickCard}>
            <img className="card-image" src={image} alt="profile picture" />
            <h2 className="card-title">{titlu}</h2>
            <h3 className="card-author">Autor: {autor}</h3>
            <p className="card-text">{displayDescriere}</p>
        </div>
    );
}

export default Card;
