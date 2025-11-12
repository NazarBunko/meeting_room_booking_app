const BOOKINGS_KEY = 'room_bookings_db';

const loadBookings = () => {
    return JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
};

const saveBookings = (bookings) => {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
};

const datetimeToMs = (date, time) => {
    return new Date(`${date}T${time}:00`).getTime();
};

export const fetchAllBookings = () => {
    return loadBookings();
};

export const checkConflict = ({ roomId, date, startTime, endTime, bookingId = null }) => {
    const existingBookings = loadBookings();

    const relevantBookings = existingBookings.filter(b => 
        b.roomId === roomId && 
        b.date === date &&
        b.id !== bookingId
    );

    const newStart = datetimeToMs(date, startTime);
    const newEnd = datetimeToMs(date, endTime);

    for (const booking of relevantBookings) {
        const existingStart = datetimeToMs(booking.date, booking.startTime);
        const existingEnd = datetimeToMs(booking.date, booking.endTime);

        if (newStart < existingEnd && newEnd > existingStart) {
            return true;
        }
    }

    return false;
};

export const fetchBookingsByRoom = (roomId) => {
    const bookings = loadBookings();
    return bookings.filter(b => b.roomId === roomId);
};

export const addBooking = (bookingData) => {
    if (datetimeToMs(bookingData.date, bookingData.endTime) <= datetimeToMs(bookingData.date, bookingData.startTime)) {
        return { success: false, message: "Час закінчення має бути пізнішим за час початку." };
    }

    if (checkConflict(bookingData)) {
        return { success: false, message: "Конфлікт часу! Кімната вже заброньована на цей час." };
    }
    
    const bookings = loadBookings();
    const newBooking = { 
        ...bookingData, 
        id: Date.now(), 
        createdAt: new Date().toISOString(),
    };
    
    saveBookings([...bookings, newBooking]);
    return { success: true, booking: newBooking };
};

export const editBooking = (updatedBooking) => {
    if (checkConflict({ ...updatedBooking, bookingId: updatedBooking.id })) {
        return { success: false, message: "Конфлікт часу! Ваші зміни перетинаються з іншим бронюванням." };
    }

    const bookings = loadBookings();
    
    const newBookings = bookings.map(b => 
        b.id === updatedBooking.id ? { ...b, ...updatedBooking } : b
    );
    
    saveBookings(newBookings);
    return { success: true, booking: updatedBooking }; 
};

export const cancelBooking = (id) => {
    const bookings = loadBookings();
    
    const newBookings = bookings.filter(b => b.id !== id);
    
    saveBookings(newBookings);
    return { success: true };
};