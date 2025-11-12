import { useMemo, useCallback } from 'react';
import { cancelBooking, joinBooking, leaveBooking } from '../services/bookingsService';

function useBookingActions({ bookings, currentUser, setEditingBooking, setIsBookingModalOpen, onDataUpdate }) {
    
    const formatTime = (time) => time ? time.substring(0, 5) : 'N/A';

    const sortedBookings = useMemo(() => {
        return [...bookings].sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.startTime}`);
            const dateB = new Date(`${b.date}T${b.startTime}`);
            return dateB - dateA; 
        });
    }, [bookings]);

    const handleEditBooking = useCallback((booking) => {
        setEditingBooking(booking);
        setIsBookingModalOpen(true);
    }, [setEditingBooking, setIsBookingModalOpen]);

    const handleCancelBooking = useCallback((bookingId) => {
        if (window.confirm("Ви впевнені, що хочете скасувати це бронювання?")) {
            cancelBooking(bookingId);
            alert("Бронювання скасовано.");
            if (onDataUpdate) onDataUpdate();
        }
    }, [onDataUpdate]);

    const handleJoinBooking = useCallback((bookingId, isJoin) => {
        if (!currentUser) {
            alert("Помилка: не вдалося ідентифікувати користувача.");
            return;
        }
        
        let result;
        if(isJoin){
            result = joinBooking(bookingId, currentUser);
        } else {
            result = leaveBooking(bookingId, currentUser);
        }
        
        if (result.success) {
            alert(isJoin ? "Ви успішно долучились до зустрічі!" : "Ви успішно вийшли зі зустрічі!");
            if (onDataUpdate) onDataUpdate();
        } else {
            alert(result.message);
        }
    }, [currentUser, onDataUpdate]);

    const handleCloseModalAndUpdate = useCallback(() => {
        setIsBookingModalOpen(false);
        if (onDataUpdate) onDataUpdate();
    }, [setIsBookingModalOpen, onDataUpdate]);

    return {
        formatTime,
        handleEditBooking,
        handleCancelBooking,
        handleJoinBooking,
        handleCloseModalAndUpdate,
        sortedBookings,
    };
}

export default useBookingActions;