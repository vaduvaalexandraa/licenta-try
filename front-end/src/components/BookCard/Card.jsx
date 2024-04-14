import './Card.css'
function Card(props){
    const {image,titlu, autor, descriere}=props 
    return(
       <div className="card">
            <img className="card-image" src={image} alt="profile picture"></img>
            <h2 className="card-title">{titlu}</h2>
            <h3 className="card-author">Autor: {autor}</h3>
            <p className="card-text">{descriere}</p>
       </div> 
    );
}
export default Card