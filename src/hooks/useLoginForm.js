import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService.js';

function useLoginForm() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = useCallback((event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = useCallback((event) => {
        event.preventDefault(); 
        setIsLoading(true);

        const result = loginUser(formData.email, formData.password );

        setTimeout(() => {
            setIsLoading(false);
            if (result.success) {
                alert(`Вхід успішний для: ${formData.email}`);
                navigate('/rooms', { replace: true });
            } else {
                alert(result.message);
            }
        }, 500);
    }, [formData, navigate]);

    return {
        formData,
        isLoading,
        handleChange,
        handleSubmit,
    };
}

export default useLoginForm;