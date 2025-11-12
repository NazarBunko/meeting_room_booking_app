import React, { useState, useEffect, useMemo } from 'react';
import Input from '../UI/Input.jsx';
import Button from '../UI/Button.jsx';
import Modal from '../UI/Modal.jsx'; 
import { findUserByEmail, getCurrentUser } from '../../services/authService.js'; 
import { addBooking, editBooking } from '../../services/bookingsService.js';

const initialFormData = {
    roomId: null,
    date: '',
    startTime: '09:00',
    endTime: '10:00',
    description: '',
    participants: [],
};

function BookingModal({ isOpen, onClose, room, onBookingSuccess, initialData }) {
    
    const isEditMode = !!initialData; 

    const currentUser = useMemo(() => getCurrentUser(), [isOpen]); 

    const [formData, setFormData] = useState(initialFormData);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [newParticipantEmail, setNewParticipantEmail] = useState('');
    const [isChanged, setChanged] = useState(false); 
    
    useEffect(() => {
        if (isOpen && !isChanged) {
            if (isEditMode) {
                setFormData(initialData);
            } else {
                setFormData({
                    ...initialFormData, 
                    roomId: room?.id,
                    participants: currentUser ? [{ 
                        id: currentUser.id, 
                        email: currentUser.email, 
                        role: currentUser.role, 
                        name: currentUser.name 
                    }] : [],
                });
            }
        }
        
        if (!isOpen) {
            setChanged(false);
            setError('');
        }
    }, [isOpen, initialData, room, currentUser, isEditMode]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setChanged(true);
        setError('');
    };

    const handleAddParticipant = () => {
        const email = newParticipantEmail.trim();
        
        if (!email) {
            setError('Введіть email.');
            return;
        }
        
        if (formData.participants.some(p => p.email === email)) {
            setError('Цей учасник уже доданий.');
            return;
        }
        
        const user = findUserByEmail(email);

        if (!user) {
             setError('Користувач з таким email не зареєстрований.');
             return;
        }

        const newParticipant = { id: user.id, email: user.email, role: user.role, name: user.name }; 
        setFormData(prev => ({ 
            ...prev, 
            participants: [...prev.participants, newParticipant] 
        }));
        setNewParticipantEmail('');
        setChanged(true);
        setError('');
    };

    const handleRemoveParticipant = (emailToRemove) => {
        if (currentUser && emailToRemove === currentUser.email) {
            setError('Ви не можете видалити себе із зустрічі.');
            return;
        }
        
        setChanged(true); 
        
        setFormData(prev => ({
            ...prev,
            participants: prev.participants.filter(p => p.email !== emailToRemove)
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError('');

        if (new Date(`2000/01/01 ${formData.endTime}`) <= new Date(`2000/01/01 ${formData.startTime}`)) {
             setError("Час закінчення має бути пізнішим за час початку.");
             setIsLoading(false);
             return;
        }
        
        const serviceFunc = isEditMode ? editBooking : addBooking;
        const result = serviceFunc(formData);
        
        setTimeout(() => {
            setIsLoading(false);
            if (result.success) {
                alert(`Бронювання ${isEditMode ? 'оновлено' : 'створено'} успішно.`);
                onBookingSuccess();
                onClose();
            } else {
                setError(result.message || "Помилка бронювання/конфлікт часу.");
            }
        }, 800);
    };

    const generateTimeOptions = () => {
        const options = [];
        for (let h = 0; h < 24; h++) {
            const time = `${h < 10 ? '0' + h : h}:00`;
            options.push(<option key={time} value={time}>{time}</option>);
        }
        return options;
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={() => {
                setChanged(false);
                onClose();
            }} 
            title={isEditMode ? "Редагувати Бронювання" : `Бронювання: ${room?.name || ''}`}
        >
            <form onSubmit={handleSubmit}>
                
                <h4 style={{ margin: '0 0 15px', color: '#007bff' }}>{room?.name || ''}</h4>
                
                <p style={{ margin: '5px 0', fontWeight: 'bold' }}>Дата та час:</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Input type="date" name="date" value={formData.date} onChange={handleChange} required style={{ flex: 2 }} />
                    <select name="startTime" value={formData.startTime} onChange={handleChange} required style={{ padding: '10px', flex: 1 }}>
                        {generateTimeOptions()}
                    </select>
                    <select name="endTime" value={formData.endTime} onChange={handleChange} required style={{ padding: '10px', flex: 1 }}>
                        {generateTimeOptions()}
                    </select>
                </div>

                <p style={{ margin: '15px 0 5px', fontWeight: 'bold' }}>Мета зустрічі:</p>
                <Input 
                    type="text" 
                    name="description" 
                    placeholder="Опис зустрічі" 
                    value={formData.description} 
                    onChange={handleChange} 
                    required 
                />

                <p style={{ margin: '15px 0 5px', fontWeight: 'bold' }}>Додати учасника (Email):</p>
                <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                    <Input 
                        type="email" 
                        placeholder="Email учасника" 
                        value={newParticipantEmail} 
                        onChange={(e) => setNewParticipantEmail(e.target.value)} 
                    />
                    <Button type="button" onClick={handleAddParticipant} style={{ width: '150px' }}>
                        Додати
                    </Button>
                </div>
                
                <div style={{ fontSize: '0.9em', border: '1px solid #eee', padding: '10px', borderRadius: '4px' }}>
                    {formData.participants.map(p => (
                        <div key={p.id || p.email} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', padding: '3px 0' }}>
                            <span>{p.name} ({p.role})</span>
                            {(!currentUser || p.email !== currentUser.email) && (
                                <span onClick={() => handleRemoveParticipant(p.email)} style={{ color: 'red', cursor: 'pointer', fontWeight: 'bold' }}>
                                    &times;
                                </span>
                            )}
                        </div>
                    ))}
                </div>

                {error && <p style={{ color: 'red', margin: '10px 0' }}>{error}</p>}
                
                <Button 
                    type="submit" 
                    loading={isLoading} 
                    style={{ marginTop: '20px' }}
                    disabled={!formData.date || !formData.description || formData.participants.length === 0}
                >
                    {isEditMode ? 'Зберегти Зміни' : 'Забронювати Кімнату'}
                </Button>
                
            </form>
        </Modal>
    );
}

export default BookingModal;