import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/UI/Button';

const participants = [
    { id: 101, name: 'Admin User', role: 'Admin' },
    { id: 102, name: 'Ольга П.', role: 'User' },
    { id: 103, name: 'Іван М.', role: 'User' },
];

const UserTile = ({ user }) => (
    <div style={{ 
        width: '200px', height: '200px', 
        backgroundColor: user.role === 'Admin' ? '#f06' : '#39c', 
        color: 'white', 
        borderRadius: '8px', 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        margin: '10px'
    }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{user.name.charAt(0)}</div>
        <div style={{ fontSize: '18px' }}>{user.name.split(' ')[0]}</div>
        <div style={{ fontSize: '14px', opacity: 0.8 }}>({user.role})</div>
    </div>
);


function RoomDetailsPage() {
    const { roomId } = useParams();
    const navigate = useNavigate();

    const leaveMeating = () => {
        alert('Завершення дзвінка!');
        navigate('/rooms', { replace: true });
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ textAlign: 'center' }}>Зустріч у Кімнаті #{roomId}</h1>
            
            <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                justifyContent: 'center', 
                padding: '20px',
                marginTop: '20px',
                marginBottom: '50px'
            }}>
                {participants.map(user => (
                    <UserTile key={user.id} user={user} />
                ))}
            </div>
            
            <Button onClick={() => leaveMeating()} style={{ background: 'red', margin: '0 auto', display: 'block', width: '200px' }}>
                Покинути зустріч
            </Button>
        </div>
    );
}

export default RoomDetailsPage;