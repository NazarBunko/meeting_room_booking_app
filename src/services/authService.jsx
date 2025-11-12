const USER_DB_KEY = 'meeting_app_users_db';
const TOKEN_KEY = 'auth_token';

export const loadUsers = () => {
    return JSON.parse(localStorage.getItem(USER_DB_KEY) || '[]');
};

export const saveUsers = (users) => {
    localStorage.setItem(USER_DB_KEY, JSON.stringify(users));
};

export const findUserByEmail = (email) => {
    const users = loadUsers();
    return users.find(u => u.email === email);
};

export const registerUser = ({ name, email, password }) => {
    if (findUserByEmail(email)) {
        return { success: false, message: 'Користувач з таким email вже існує.' };
    }

    const newUser = { 
        name, 
        email, 
        password, 
        role: 'User'
    };

    const users = loadUsers();
    saveUsers([...users, newUser]);
    
    return { success: true, user: newUser };
};

export const loginUser = (email, password) => {
    const user = findUserByEmail(email);

    if (user && user.password === password) {
        const fakeToken = `token-${user.email}-${Date.now()}`;
        localStorage.setItem(TOKEN_KEY, fakeToken);
        return { success: true, user: { email: user.email, name: user.name, role: user.role } };
    }
    
    return { success: false, message: 'Неправильний email або пароль.' };
};

export const logoutUser = () => {
    localStorage.removeItem(TOKEN_KEY);
};

export const getCurrentUserToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

(function initUsers() {
    const users = loadUsers();
    if (users.length === 0) {
        const adminUser = {
            name: 'Admin',
            email: 'admin@app.com',
            password: 'admin',
            role: 'Admin'
        };
        saveUsers([adminUser]);
        console.log("Admin ініціалізовано: admin@app.com / admin");
    }
})();