
function Profile(){
    return(
        <div>
            <h1>Profile</h1>
            <p>Information about you will be displayed here in the future!</p>
            {/* useEffect(() => {
        const fetchCarti = async () => {
            try {
                const [carticele, autorasi] = await Promise.all([
                    axios.get('http://localhost:5000/carti'),
                    axios.get('http://localhost:5000/autori')
                ]);

                const carticeleData = carticele.data;
                const autorasiData = autorasi.data;

                const carticeleFinal = carticeleData.map((carte) => {
                    const autor = autorasiData.find((autor) => autor.id === carte.idAutor);
                    const poza = carte.imagineCarte && carte.imagineCarte.length > 0 ? carte.imagineCarte[0] : null;
                    if (autor) {
                        return {
                            image: `http://localhost:5000/uploads/find/${poza}`,
                            titlu: carte.titlu,
                            autor: autor.nume + ' ' + autor.prenume,
                            descriere: carte.descriere
                        };
                    }
                    return null;
                });

                setCarti(carticeleFinal);
            
            }catch(error){
                console.error('Error fetching books:', error);
            }
        };

        fetchCarti();
    }, []); */}
        </div>
    )
    }
    
    export default Profile;