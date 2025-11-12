import { useState, useCallback } from 'react';
import { registerUser } from '../services/authService.js';
import { useNavigate } from 'react-router-dom';

function useRegistrationForm() {
    const [formData, setFormData] = useState({name: '', email: '', password: '', confirmPassword: ''});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleChange = useCallback((event) => {
        const { name, value } = event.target;
        
        setFormData(prev => {
            const updatedFormData = { ...prev, [name]: value };

            if (name === 'password' || name === 'confirmPassword') {
                if (updatedFormData.password && updatedFormData.confirmPassword && updatedFormData.password !== updatedFormData.confirmPassword) {
                    setError('Паролі мають співпадати');
                } else {
                    // Очищаємо помилку, якщо паролі співпали або одне з полів стало порожнім
                    if (updatedFormData.password === updatedFormData.confirmPassword || (!updatedFormData.password && !updatedFormData.confirmPassword)) {
                         setError('');
                    } else if (name === 'password' && updatedFormData.confirmPassword && updatedFormData.password !== updatedFormData.confirmPassword) {
                        setError('Паролі мають співпадати');
                    } else if (name === 'confirmPassword' && updatedFormData.password && updatedFormData.password !== updatedFormData.confirmPassword) {
                        setError('Паролі мають співпадати');
                    }
                }
            }

            return updatedFormData;
        });
    }, []);

    const handleSubmit = useCallback((event) => {
        event.preventDefault(); 
        
        const isPasswordMismatch = formData.password !== formData.confirmPassword;

        if (error || isPasswordMismatch) {
            alert("Будь ласка, виправте помилку співпадіння паролів.");
            return;
        }

        setIsLoading(true);
        const result = registerUser({ name: formData.name, email: formData.email, password: formData.password });

        if(result.success){
            setTimeout(() => {
                setIsLoading(false);
                alert(`Реєстрація успішна для: ${formData.email}`);
                navigate('/rooms', { replace: true });
            }, 1500); 
        } else {
            setIsLoading(false);
            alert(result.message);
        }
    }, [formData, error, navigate]);

    const isFormIncomplete = !formData.name 
                          || !formData.email 
                          || !formData.password 
                          || !formData.confirmPassword;
    
    const isPasswordMismatch = formData.password !== formData.confirmPassword;
    
    const isSubmitDisabled = isFormIncomplete || isPasswordMismatch;


    return {
        formData,
        isLoading,
        error,
        handleChange,
        handleSubmit,
        isSubmitDisabled,
    };
}

export default useRegistrationForm;