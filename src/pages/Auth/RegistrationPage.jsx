import React from 'react';
import Input from '../../components/UI/Input.jsx'; 
import Button from '../../components/UI/Button.jsx'; 
import useRegistrationForm from '../../hooks/useRegistrationForm.js'; 

function RegistrationPage() {
    const {
        formData,
        isLoading,
        error,
        handleChange,
        handleSubmit,
        isSubmitDisabled,
    } = useRegistrationForm();

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
                    disabled={isSubmitDisabled} 
                >
                    Зареєструватись
                </Button>

                <p style={{textAlign: 'center', fontSize: '0.9em'}}>Вже зареєстровані? <a href='/login'>Увійти</a></p>
            </form>
        </div>
    );
}

export default RegistrationPage;