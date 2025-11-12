import React, { useState, useEffect } from 'react';
import { loadUsers } from '../../services/authService';
import styles from './UsersPage.module.css';

function UsersPage() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timerId = setTimeout(() => {
            try {
                const allUsers = loadUsers(); 
                setUsers(allUsers);
                setIsLoading(false);
            } catch (error) {
                console.error("Помилка при завантаженні користувачів:", error);
                setIsLoading(false);
            }
        }, 500);

        return () => clearTimeout(timerId);
    }, []);

    if (isLoading) {
        return (
            <div className={styles.loading}>
                <p>Завантаження даних користувачів...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Список Користувачів</h2>
            
            {users.length === 0 ? (
                <p className={styles.noUsers}>Користувачів поки немає.</p>
            ) : (
                <table className={styles.table}>
                    <thead>
                        <tr className={styles.tableHeaderRow}>
                            <th className={styles.tableCell}>ID</th>
                            <th className={styles.tableCell}>Ім'я</th>
                            <th className={styles.tableCell}>Email</th>
                            <th className={styles.tableCell}>Роль</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr 
                                key={user.email}
                                className={styles.tableRow}
                            >
                                <td className={styles.tableCell}>{index + 1}</td>
                                <td className={styles.tableCell}>{user.name}</td>
                                <td className={styles.tableCell}>{user.email}</td>
                                <td className={styles.tableCell}>{user.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default UsersPage;