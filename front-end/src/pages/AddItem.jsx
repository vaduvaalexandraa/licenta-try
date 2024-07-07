import React,{useState, useEffect} from "react";
import "./AddItem.css";
import AddAuthor from "../components/AddAuthor/AddAuthor";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import genuri from "../list-components";


function AddItem(){
    const navigate = useNavigate()

    const goToHome=()=>{
        navigate("/home");
    }
    const[step, setStep]=useState(1);

    const[authorId,setAuthorData]=useState(0);

    const handleAuthorData =(data) =>{
        setAuthorData(data);
        console.log(data);
        setStep(2);
    }

    //de aici incepe partea de carte

    const [ISBN, setISBN] = useState("");
    const [titlu, setTitlu] = useState("");
    const [genLiterar, setGenLiterar] = useState("");
    const [anulPublicarii, setAnulPublicarii] = useState("");
    const [numarPagini, setNumarPagini] = useState("");
    const [descriere, setDescriere] = useState("");
    const [nrExemplareDisponibile, setNrExemplareDisponibile] = useState("");
    const [image, setPhotos] = useState([]); // State to store the base64 string of the image
    
    // const genuri=["drama","poezie","roman","nuvela","epopee","eseu","jurnal","memorialistica","publicistica","biografie",
    // "autobiografie","corespondenta","critica","teatru","scenariu","fantasy","psihologie","altele","istorie"]


    const handleSubmit = async (event) => {
        event.preventDefault();
        const bookData = { 
            ISBN: ISBN,
            titlu: titlu,
            idAutor: authorId,
            genLiterar: genLiterar,
            anulPublicarii: anulPublicarii,
            numarPagini: numarPagini,
            descriere: descriere,
            nrExemplareDisponibile: nrExemplareDisponibile,
            imagineCarte: image
         };
        if(bookData!==null){
        const cv = await insertBookInDatabase(bookData);}
        goToHome();
        console.log(bookData);
        
    };

    const insertBookInDatabase = async (bookData) => {
        try {
            const response = await axios.post("http://localhost:5000/carti", bookData);
            return response.data;
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    
    

    const postMultipleFiles = async (filelist) => {
        console.log(filelist);
        const formData = new FormData();
        for(let index=0;index<filelist.length;index++){
           const file=filelist[index];
           formData.append('files',file);
           
        }
        try{
            const response=await axios.post("http://localhost:5000/multifiles",formData);
            console.log(response.data.map(photo => photo.filename));
            setPhotos(response.data.map(photo => photo.filename));
            console.log(response.data);
        }catch(error){
            console.log(error);
        }
    }


    return (
        <>
            <div className="book-add">
                {step === 1 && <AddAuthor onAuthorSubmit={handleAuthorData}></AddAuthor>}

                {step === 2 && (
                    <div className="add-book-container">
                        <h1>Adauga o noua carte</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="ISBN">ISBN:</label>
                                <input
                                    type="text"
                                    id="ISBN"
                                    value={ISBN}
                                    onChange={(e) => setISBN(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="titlu">Titlu:</label>
                                <input
                                    type="text"
                                    id="titlu"
                                    value={titlu}
                                    onChange={(e) => setTitlu(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="genLiterar">Gen literar:</label>
                                <select
                                    id="genLiterar"
                                    value={genLiterar}
                                    onChange={(e) => setGenLiterar(e.target.value)}
                                >
                                    <option value="">Selecteaza un gen literar</option>
                                    {genuri.map((gen, index) => (
                                        <option key={index} value={gen}>
                                            {gen}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="anulPublicarii">Anul publicarii:</label>
                                <input
                                    type="number"
                                    id="anulPublicarii"
                                    value={anulPublicarii}
                                    onChange={(e) => setAnulPublicarii(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="numarPagini">Numar pagini:</label>
                                <input
                                    type="number"
                                    id="numarPagini"
                                    value={numarPagini}
                                    onChange={(e) => setNumarPagini(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="descriere">Descriere:</label>
                                <textarea
                                    id="descriere"
                                    value={descriere}
                                    onChange={(e) => setDescriere(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="nrExemplareDisponibile">Numar exemplare disponibile:</label>
                                <input
                                    type="number"
                                    id="nrExemplareDisponibile"
                                    value={nrExemplareDisponibile}
                                    onChange={(e) => setNrExemplareDisponibile(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="image">Imagine:</label>
                                <input
                                    type="file"
                                    id="image"
                                    multiple
                                    onChange={(event) => {
                                        const filelist = event.target.files;
                                        postMultipleFiles(filelist);
                                    }}
                                />
                            </div>
                            <button type="submit">Adauga carte</button>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
}

export default AddItem;