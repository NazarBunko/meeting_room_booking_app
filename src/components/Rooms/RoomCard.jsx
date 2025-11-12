import React from 'react';
import Button from '../UI/Button.jsx';

function RoomCard({ room, onEdit, onDelete, onJoin, onBook }) {
    const isUserAdmin = true; 

    return (
        <div style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '10px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
                <h3>{room.name}</h3>
                <p style={{ fontSize: '0.9em', color: '#666' }}>{room.description}</p>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
                <Button onClick={() => onJoin(room.id)}>Приєднатися</Button>
                {isUserAdmin && (
                    <>
                        <Button onClick={() => onEdit(room)} style={{ background: 'orange' }}>Редагувати</Button>
                        <Button onClick={() => onDelete(room.id)} style={{ background: 'red' }}>Видалити</Button>
                        <Button onClick={() => onBook(room.id)} style={{ background: '#1AB394' }}>Забронювати</Button>
                    </>
                )}
            </div>
        </div>
    );
}

export default RoomCard;