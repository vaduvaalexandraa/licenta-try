import './Card.css'

function Card(props){
    const { image, titlu, autor, descriere } = props;
    const truncatedDescriere = descriere.substring(0, 230);
    const displayDescriere = descriere.length > 200 ? `${truncatedDescriere}...` : truncatedDescriere;

    return (
        <div className="card-holder">
            <img className="card-image" src={image} alt="profile picture" />
            <h2 className="card-title">{titlu}</h2>
            <h3 className="card-author">Autor: {autor}</h3>
            <p className="card-text">{displayDescriere}</p>
        </div>
    );
}
export default Card;