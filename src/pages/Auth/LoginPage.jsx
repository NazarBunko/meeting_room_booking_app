import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/UI/Input.jsx'; 
import Button from '../../components/UI/Button.jsx';
import { loginUser } from '../../services/authService.js';

function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault(); 
    setIsLoading(true);

    console.log("Відправка даних:", formData);
    const result = loginUser(formData.email, formData.password );

    if (result.success) {
      setTimeout(() => {
        setIsLoading(false);
        alert(`Вхід успішний для: ${formData.email}`);
        navigate('/rooms', { replace: true });
      }, 1500); 
    } else {
      setIsLoading(false);
      alert(result.message);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center' }}>Вхід у Систему</h2>
      <form onSubmit={handleSubmit}>
        
        <Input
          type="email"
          name="email"
          placeholder="Електронна пошта"
          value={formData.email}
          onChange={handleChange}
          required
        />
        
        <Input
          type="password"
          name="password"
          placeholder="Пароль"
          value={formData.password}
          onChange={handleChange}
          required
        />
        
        <Button 
          type="submit"
          loading={isLoading}
          disabled={!formData.email || !formData.password}
        >
          Увійти
        </Button>

        <p style={{textAlign: 'center', fontSize: '0.9em'}}>Ще не зареєстровані? <a href='/register'>Зареєструватись</a></p>
        
      </form>
    </div>
  );
}

export default LoginPage;