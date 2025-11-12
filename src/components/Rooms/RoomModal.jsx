import React, { useState, useEffect } from 'react';
import Input from '../UI/Input.jsx';
import Button from '../UI/Button.jsx';
import Modal from '../UI/Modal.jsx'; 
import { addRoom, editRoom } from '../../services/roomsService.js'; 

const initialFormData = {
    name: '',
    description: '',
};

function RoomModal({ isOpen, onClose, initialData, onSaveSuccess }) {
    const [formData, setFormData] = useState(initialData || initialFormData);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    useEffect(() => {
        setFormData(initialData || initialFormData);
        setError('');
    }, [initialData, isOpen]);


    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError('');

        const serviceFunc = initialData ? editRoom : addRoom;
        
        if (!formData.name || !formData.description) {
            setError("Всі поля обов'язкові.");
            setIsLoading(false);
            return;
        }

        const result = serviceFunc(formData); 
        
        setTimeout(() => { 
            setIsLoading(false);
            if (result.success) {
                onSaveSuccess(result.room);
                onClose();
            } else {
                setError(result.message || "Невідома помилка збереження.");
            }
        }, 800);
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={initialData ? "Редагувати кімнату" : "Створити кімнату"}
        >
            <form onSubmit={handleSubmit}>
                
                <p style={{ margin: '5px 0', fontWeight: 'bold' }}>Назва:</p>
                <Input 
                    type="text" 
                    name="name" 
                    placeholder="Назва переговорної" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                />

                <p style={{ margin: '15px 0 5px', fontWeight: 'bold' }}>Опис:</p>
                <Input 
                    type="text" 
                    name="description" 
                    placeholder="Короткий опис" 
                    value={formData.description} 
                    onChange={handleChange} 
                    required 
                />

                {error && <p style={{ color: 'red', margin: '10px 0' }}>{error}</p>}
                
                <Button 
                    type="submit" 
                    loading={isLoading} 
                    style={{ marginTop: '20px' }}
                >
                    {initialData ? 'Зберегти зміни' : 'Створити'}
                </Button>
                
            </form>
        </Modal>
    );
}

export default RoomModal;