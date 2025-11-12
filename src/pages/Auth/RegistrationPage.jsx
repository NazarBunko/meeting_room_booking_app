import React, { useState } from 'react';
import Input from '../../components/UI/Input.jsx'; 
import Button from '../../components/UI/Button.jsx'; 
import { registerUser } from '../../services/authService.js';
import { useNavigate } from 'react-router-dom';

function RegistrationPage() {
  const [formData, setFormData] = useState({name: '', email: '', password: '', confirmPassword: ''});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    
    setFormData(prev => {
      const updatedFormData = { ...prev, [name]: value };

      if (name === 'password' || name === 'confirmPassword') {
        if (updatedFormData.password && updatedFormData.confirmPassword && updatedFormData.password !== updatedFormData.confirmPassword) {
            setError('Паролі мають співпадати');
        } else {
            setError('');
        }
      }

      return updatedFormData;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault(); 
    
    if (error || formData.password !== formData.confirmPassword) {
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
      alert(result.message);
    }
  };
  
  const isFormIncomplete = !formData.name 
                          || !formData.email 
                          || !formData.password 
                          || !formData.confirmPassword;
  
  const isPasswordMismatch = formData.password !== formData.confirmPassword;


  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2 style={{textAlign: 'center'}}>Реєстрація</h2>
      <form onSubmit={handleSubmit}>

        <Input type="text" name="name" placeholder="Ім'я" value={formData.name} onChange={handleChange} required />
        <Input type="email" name="email" placeholder="Електронна пошта" value={formData.email} onChange={handleChange} required />
        <Input type="password" name="password" placeholder="Пароль" value={formData.password} onChange={handleChange} required />
        <Input type="password" name="confirmPassword" placeholder="Підтвердіть пароль" value={formData.confirmPassword} onChange={handleChange} required />

        {error && <p style={{color: 'red', fontSize: '0.9em', margin: '5px 0'}}>{error}</p>}
        
        <Button 
          type="submit"
          loading={isLoading}
          disabled={isFormIncomplete || isPasswordMismatch} 
        >
          Зареєструватись
        </Button>

        <p style={{textAlign: 'center', fontSize: '0.9em'}}>Вже зареєстровані? <a href='/login'>Увійти</a></p>
      </form>
    </div>
  );
}

export default RegistrationPage;