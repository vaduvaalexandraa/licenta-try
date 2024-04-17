import React, { useState } from "react";
import "./AddAuthor.css";
import axios from "axios";
import user_icon from "../../assets/person.png";


function AddAuthor({onAuthorSubmit}) {
    const [nume, setNume] = useState("");
    const [prenume, setPrenume] = useState("");


    const handleSubmit = async (event) => {
        if(!validateForm()){    
            return;
        }
        event.preventDefault();
        const authorData={nume, prenume};

        const dataFROMDB=await validateAuthorExistence(authorData);
        console.log("db"+dataFROMDB);

        onAuthorSubmit(dataFROMDB);//trimit id-ul autorului in AddItem
    
    };

    const insertAuthorInDatabase = async (authorData) => {
        try{
            const response=await axios.post("http://localhost:5000/autori",authorData);
            return response.data;
        }
        catch(error){
            console.log(error);
            return null;
        }
    }
        

    const validateAuthorExistence = async (authorData) => {
        try {
            const response = await axios.get(`http://localhost:5000/autori/find/${authorData.nume}&${authorData.prenume}`);
            if (response.data && response.data.id) {
                window.alert("Autorul există deja în baza de date!");
                return response.data.id;
            } else {
                // Insert în baza de date
                const responseFromDB = await insertAuthorInDatabase(authorData);
                return responseFromDB.id;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    

   
    

    const validateForm = () => {
        if(nume==="" || prenume===""){
            window.alert("Campurile pentru nume si prenume nu sunt completate!")
            return false;
        }
        if(nume.length<3 || prenume.length<3){
            window.alert("Campurile pentru nume si prenume trebuie sa aiba cel putin 3 caractere!")
            return false;
        }
        return true;
    }


    


    return (
        <div className="add-author-container">
            <h1>Adauga autorul cartii</h1>
           <form onSubmit={handleSubmit}>
            <label>
                Nume:
                <input type="text" value={nume} onChange={(e)=>setNume(e.target.value)} />
            </label>
            <label>
                Prenume:
                <input type="text" value={prenume}  onChange={(e)=>setPrenume(e.target.value)} />
            </label>
            <button type="submit">Adauga autor</button>
            </form>
        </div>
    );
}

export default AddAuthor;