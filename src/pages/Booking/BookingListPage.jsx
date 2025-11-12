import React, { useState, useEffect } from 'react';
import BookingTable from '../../components/Bookings/BookingsTable.jsx';
import { fetchRooms } from '../../services/roomsService.js';
import { fetchAllBookings } from '../../services/bookingsService.js';

function BookingListPage() {
    const [bookings, setBookings] = useState([]);
    const [roomsMap, setRoomsMap] = useState({}); 
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        
        setTimeout(() => {
            const allBookings = fetchAllBookings();
            
            const roomsData = fetchRooms();
            const roomMap = roomsData.reduce((acc, room) => {
                acc[room.id] = room.name;
                return acc;
            }, {});

            setBookings(allBookings);
            setRoomsMap(roomMap);
            setIsLoading(false);
        }, 500);
    }, []);

    if (isLoading) {
        return <p style={{ textAlign: 'center', marginTop: '50px' }}>Завантаження бронювань...</p>;
    }

    return (
        <div style={{ maxWidth: '1000px', margin: '50px auto', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ margin: 0 }}>Всі Заплановані Бронювання</h2>
                <div style={{ width: '150px' }}></div>
            </div>
            
            {bookings.length === 0 ? (
                <p style={{ textAlign: 'center' }}>Наразі немає активних бронювань.</p>
            ) : (
                <BookingTable bookings={bookings} roomsMap={roomsMap} />
            )}
        </div>
    );
}

export default BookingListPage;