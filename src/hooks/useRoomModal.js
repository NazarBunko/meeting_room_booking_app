import { useState, useEffect, useCallback } from 'react';
import { addRoom, editRoom } from '../services/roomsService.js';

const initialFormData = {
    name: '',
    description: '',
};

function useRoomModal({ initialData, isOpen, onSaveSuccess, onClose }) {
    const [formData, setFormData] = useState(initialData || initialFormData);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const isEditing = !!initialData;
    const modalTitle = isEditing ? "Редагувати кімнату" : "Створити кімнату";

    useEffect(() => {
        setFormData(initialData || initialFormData);
        setError('');
    }, [initialData, isOpen]);

    const handleChange = useCallback((event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    }, []);

    const handleSubmit = useCallback((event) => {
        event.preventDefault();
        setIsLoading(true);
        setError('');

        const serviceFunc = isEditing ? editRoom : addRoom;
        
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
    }, [formData, isEditing, onClose, onSaveSuccess]);

    return {
        formData,
        isLoading,
        error,
        modalTitle,
        handleChange,
        handleSubmit,
    };
}

export default useRoomModal;