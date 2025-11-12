import { useState, useEffect, useMemo } from 'react';
import { findUserByEmail, getCurrentUser } from '../services/authService.js'; 
import { addBooking, editBooking } from '../services/bookingsService';

const initialFormData = {
    roomId: null,
    date: '',
    startTime: '09:00',
    endTime: '10:00',
    description: '',
    participants: [],
};

export const useBookingForm = (isOpen, room, initialData, onBookingSuccess, onClose) => {
    
    const isEditMode = !!initialData; 
    
    const currentUser = useMemo(() => getCurrentUser(), [isOpen]); 

    const [formData, setFormData] = useState(initialFormData);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [newParticipantEmail, setNewParticipantEmail] = useState('');
    const [isChanged, setChanged] = useState(false); 
    
    useEffect(() => {
        if (isOpen) {
            if (isEditMode && !isChanged) {
                setFormData(initialData);
            } else if(!isChanged){
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

    return {
        formData,
        isLoading,
        error,
        newParticipantEmail,
        isEditMode,
        currentUser,
        setNewParticipantEmail,
        handleChange,
        handleAddParticipant,
        handleRemoveParticipant,
        handleSubmit,
    };
};