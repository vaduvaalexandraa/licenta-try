import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminUsers.css';

function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const handleMakeAdmin = (userId) => {
    console.log(`Make admin for user with id: ${userId}`);
    const user = users.find(user => user.id === userId);
    axios.put(`http://localhost:5000/users/${userId}`, {...user, role: 'admin'})
      .then(() => {
        // update la starea locala pentru a arata imediat schimbarea
        setUsers(users.map(u => u.id === userId ? {...u, role: 'admin'} : u));
      });
  };

  const handleRemoveAdmin = (userId) => {
    console.log(`Remove admin for user with id: ${userId}`);
    const user = users.find(user => user.id === userId);
    axios.put(`http://localhost:5000/users/${userId}`, {...user, role: ''})
      .then(() => {
        
        setUsers(users.map(u => u.id === userId ? {...u, role: ''} : u));
      });
  };

  const handleBanUser = (userId) => {
    console.log(`Ban user with id: ${userId}`);
    axios.delete(`http://localhost:5000/users/${userId}`)
      .then(() => {
        
        setUsers(users.filter(u => u.id !== userId));
      });
  };

  return (
    <div className='admin-users-container'>
      <h1>Utilizatori 👥</h1>
      <br />

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid black', background: '#f2f2f2' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>👤 Nume</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>📧 Email</th>
            <th style={{ padding: '10px', textAlign: 'center' }}>⚙️ Acțiuni</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px' }}>{user.firstName} {user.lastName}</td>
              <td style={{ padding: '10px' }}>{user.email}</td>
              <td style={{ padding: '10px', textAlign: 'center' }}>
                <button className="primary" onClick={() => handleMakeAdmin(user.id)} disabled={user.role === 'admin'} style={{ marginRight: '10px' }}>Oferire Admin</button>
                <button className="secondary" onClick={() => handleRemoveAdmin(user.id)} disabled={user.role !== 'admin'} style={{ marginRight: '10px' }}>Ștergere Admin</button>
                <button onClick={() => handleBanUser(user.id)}>Închide cont</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsers;