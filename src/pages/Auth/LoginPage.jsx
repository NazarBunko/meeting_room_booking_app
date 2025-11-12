import React from 'react';
import Input from '../../components/UI/Input.jsx'; 
import Button from '../../components/UI/Button.jsx';
import useLoginForm from '../../hooks/useLoginForm.js';

function LoginPage() {
    const { 
        formData, 
        isLoading, 
        handleChange, 
        handleSubmit 
    } = useLoginForm();

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