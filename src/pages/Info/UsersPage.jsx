import React, { useState, useEffect } from 'react';
import { loadUsers } from '../../services/authService';

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      try {
        const allUsers = loadUsers(); 
        setUsers(allUsers);
        setIsLoading(false);
      } catch (error) {
        console.error("Помилка при завантаженні користувачів:", error);
        setIsLoading(false);
      }
    }, 500);
  }, []);

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <p>Завантаження даних користувачів...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Список Користувачів</h2>
      
      {users.length === 0 ? (
        <p style={{ textAlign: 'center' }}>Користувачів поки немає.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ccc', backgroundColor: '#f4f4f4' }}>
              <th style={{ padding: '10px' }}>ID</th>
              <th style={{ padding: '10px' }}>Ім'я</th>
              <th style={{ padding: '10px' }}>Email</th>
              <th style={{ padding: '10px' }}>Роль</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr 
                key={user.email}
                style={{ borderBottom: '1px solid #eee' }}
              >
                <td style={{ padding: '10px' }}>{index + 1}</td>
                <td style={{ padding: '10px' }}>{user.name}</td>
                <td style={{ padding: '10px' }}>{user.email}</td>
                <td style={{ padding: '10px' }}>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UsersPage;