import React from 'react';
import Input from '../UI/Input.jsx';
import Button from '../UI/Button.jsx';
import Modal from '../UI/Modal.jsx'; 
import useRoomModal from '../../hooks/useRoomModal.js';

function RoomModal({ isOpen, onClose, initialData, onSaveSuccess }) {
    
    const { 
        formData,
        isLoading,
        error,
        modalTitle,
        handleChange,
        handleSubmit
    } = useRoomModal({ initialData, isOpen, onSaveSuccess, onClose });
    
    const isEditing = !!initialData;

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={modalTitle}
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
                    {isEditing ? 'Зберегти зміни' : 'Створити'}
                </Button>
                
            </form>
        </Modal>
    );
}

export default RoomModal;