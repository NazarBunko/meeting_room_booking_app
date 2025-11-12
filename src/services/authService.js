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

const generateNextUserId = (users) => {
    if (users.length === 0) {
        return 1;
    }
    const maxId = users.reduce((max, user) => (user.id > max ? user.id : max), 0);
    return maxId + 1;
};

export const getCurrentUser = () => {
    const token = getCurrentUserToken();
    if (!token) return null;
    const parts = token.split('-');
    const email = parts[1];
    const user = findUserByEmail(email); 
    
    if (user) {
        return { id: user.id, name: user.name, email: user.email, role: user.role };
    }
    
    return null; 
};

export const registerUser = ({ name, email, password }) => {
    const users = loadUsers();
    if (findUserByEmail(email)) {
        return { success: false, message: 'Користувач з таким email вже існує.' };
    }

    const newUser = { 
        id: generateNextUserId(users),
        name, 
        email, 
        password, 
        role: 'User'
    };

    saveUsers([...users, newUser]);
    
    return { success: true, user: newUser };
};

export const loginUser = (email, password) => {
    const user = findUserByEmail(email);

    if (user && user.password === password) {
        const fakeToken = `token-${user.email}-${Date.now()}`;
        localStorage.setItem(TOKEN_KEY, fakeToken);
        return { success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } };
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
            id: 1,
            name: 'Admin',
            email: 'admin@app.com',
            password: 'admin',
            role: 'Admin'
        };
        saveUsers([adminUser]);
        console.log("Admin ініціалізовано: admin@app.com / admin");
    }
})();