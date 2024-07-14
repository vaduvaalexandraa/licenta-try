import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditProfile.css';

function EditProfile() {
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const idUser = sessionStorage.getItem('userId');

    useEffect(() => {
        if (idUser) {
            fetchUserData(idUser);
        }
    }, [idUser]);

    const fetchUserData = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:5000/users/${userId}`);
            const { firstName, lastName, email, phoneNumber } = response.data;
            setUserData({ firstName, lastName, email, phoneNumber });
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userData.firstName || !userData.lastName || !userData.email || !userData.phoneNumber) {
            setErrorMessage('Toate câmpurile sunt obligatorii!');
            return;
        }

        try {
            await axios.put(`http://localhost:5000/users/${idUser}`, userData);
            alert('Profilul a fost actualizat cu succes!');
            window.location.reload();
        } catch (error) {
            console.error('Error updating user profile:', error);
        }
    };

    return (
        <div className="edit-profile-page">
            <div className="edit-profile-container">
                <h2 className="edit-profile-title">Editează profil ✍🏻</h2>
                <form className="edit-profile-form" onSubmit={handleSubmit}>
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    <label className="edit-profile-label">
                        🧍‍♂️ Prenume:
                        <input
                            type="text"
                            name="firstName"
                            value={userData.firstName}
                            onChange={handleChange}
                            className="edit-profile-input"
                            required
                        />
                    </label>
                    <label className="edit-profile-label">
                        🧍‍♂️ Nume:
                        <input
                            type="text"
                            name="lastName"
                            value={userData.lastName}
                            onChange={handleChange}
                            className="edit-profile-input"
                            required
                        />
                    </label>
                    <label className="edit-profile-label">
                        📧 Email:
                        <input
                            type="email"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            className="edit-profile-input"
                            required
                        />
                    </label>
                    <label className="edit-profile-label">
                        📞 Număr de telefon:
                        <input
                            type="tel"
                            name="phoneNumber"
                            value={userData.phoneNumber}
                            onChange={handleChange}
                            className="edit-profile-input"
                            required
                        />
                    </label>
                    <button type="submit" className="edit-profile-button">Actualizează profilul</button>
                </form>
            </div>
        </div>
    );
}

export default EditProfile;
