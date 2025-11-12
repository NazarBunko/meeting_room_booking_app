const ROOMS_KEY = 'meeting_rooms_db';
const BOOKINGS_KEY = 'room_bookings_db';

const loadRooms = () => {
    return JSON.parse(localStorage.getItem(ROOMS_KEY) || '[]');
};

const saveRooms = (rooms) => {
    localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms));
};

const loadBookings = () => {
    return JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
};

(function initRooms() {
    if (loadRooms().length === 0) {
        saveRooms([
            { id: 1, name: 'Кімната 1', description: 'Для командних нарад та презентацій.' },
            { id: 2, name: 'Кімната 2', description: 'Для співбесід та індивідуальної роботи.' }
        ]);
        console.log("Кімнати ініціалізовано.");
    }
})();

export const fetchRooms = () => {
    return loadRooms();
};

export const addRoom = ({ name, description }) => {
    const rooms = loadRooms();
    
    if (rooms.some(r => r.name.toLowerCase() === name.toLowerCase())) {
        return { success: false, message: 'Кімната з такою назвою вже існує.' };
    }

    const newRoom = {
        id: Date.now(),
        name,
        description,
    };

    saveRooms([...rooms, newRoom]);
    return { success: true, room: newRoom };
};

export const editRoom = (updatedRoom) => {
    const rooms = loadRooms();
    const roomIndex = rooms.findIndex(r => r.id === updatedRoom.id);

    if (roomIndex === -1) {
        return { success: false, message: 'Кімнату не знайдено.' };
    }

    const newRooms = rooms.map(room => 
        room.id === updatedRoom.id ? { ...room, ...updatedRoom } : room
    );

    saveRooms(newRooms);
    return { success: true, room: updatedRoom };
};

export const deleteRoom = (id) => {
    const rooms = loadRooms();
    const bookings = loadBookings();

    const hasActiveBookings = bookings.some(b => b.roomId === id);

    if (hasActiveBookings) {
        return { success: false, message: 'Неможливо видалити кімнату: існують активні бронювання.' };
    }
    
    const newRooms = rooms.filter(room => room.id !== id);
    saveRooms(newRooms);
    
    return { success: true };
};