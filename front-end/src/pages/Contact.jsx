import React, { useState } from 'react';
import axios from 'axios';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [successMessage, setSuccessMessage] = useState('');

  const validateName = (name) => {
    return name.length >= 3;
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMessage = (message) => {
    return message.length > 10;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'name') {
      setErrors({
        ...errors,
        name: validateName(value) ? '' : 'Numele trebuie să conțină cel puțin 3 caractere.'
      });
    }

    if (name === 'email') {
      setErrors({
        ...errors,
        email: validateEmail(value) ? '' : 'Email-ul nu este valid.'
      });
    }

    if (name === 'message') {
      setErrors({
        ...errors,
        message: validateMessage(value) ? '' : 'Mesajul trebuie să conțină mai mult de 10 caractere.'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final validation before submission
    const isNameValid = validateName(formData.name);
    const isEmailValid = validateEmail(formData.email);
    const isMessageValid = validateMessage(formData.message);

    if (!isNameValid || !isEmailValid || !isMessageValid) {
      setErrors({
        name: isNameValid ? '' : 'Numele trebuie să conțină mai mult de 3 caractere.',
        email: isEmailValid ? '' : 'Email-ul nu este valid.',
        message: isMessageValid ? '' : 'Mesajul trebuie să conțină mai mult de 10 caractere.'
      });
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/contact', formData);
      console.log('Email trimis cu succes:', response.data);
      
      // Clear form fields
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });

      // Display success message
      setSuccessMessage('Email trimis cu succes!');
      setTimeout(() => setSuccessMessage(''), 5000); // Hide message after 5 seconds
    } catch (error) {
      console.error('Eroare la trimiterea emailului:', error);
    }
  };

  return (
    <div>
      <h1 className='contact-header'>Contact</h1>
      <p className='contact-text'>Dacă ai întrebări sau nelămuriri, nu ezita să ne contactezi. Echipa noastră îți stă la dispoziție!</p>
      <p className='contact-text'>
        Ne poți contacta la adresa de email 📧 <a href='mailto:readwithmelicenta@gmail.com'>readwithmelicenta@gmail.com</a>
      </p>
      <p className='contact-text'>Completează formularul de mai jos și te vom contacta în cel mai scurt timp posibil.</p>
      {successMessage && <p className='success-message'>{successMessage}</p>}
      <form className='contact-form' onSubmit={handleSubmit}>
        <div>
          <label className='contact-form-label'>Nume:</label>
          <input className='contact-form-input'
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {errors.name && <span className='error'>{errors.name}</span>}
        </div>
        <div>
          <label className='contact-form-label'>Email:</label>
          <input className='contact-form-input'
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <span className='error'>{errors.email}</span>}
        </div>
        <div>
          <label className='contact-form-label'>Subiect:</label>
          <input className='contact-form-input'
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className='contact-form-label'>Mesaj:</label>
          <textarea className='contact-form-textarea'
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
          {errors.message && <span className='error'>{errors.message}</span>}
        </div>
        <button className='send-contact-form-btn' type="submit">Trimite</button>
      </form>
    </div>
  );
}

export default Contact;
