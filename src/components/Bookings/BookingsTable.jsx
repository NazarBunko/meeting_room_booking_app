import React, { useState } from 'react';
import Button from '../UI/Button';
import BookingModal from './BookingModal';
import useBookingActions from '../../hooks/useBookingActions';
import { getCurrentUser } from '../../services/authService';

function BookingsTable({ bookings, roomsMap, onDataUpdate }) {
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [editingBooking, setEditingBooking] = useState(null);
    const currentUser = getCurrentUser();

    const { 
        handleEditBooking, 
        handleCancelBooking, 
        handleJoinBooking, 
        handleCloseModalAndUpdate,
        formatTime,
        sortedBookings
    } = useBookingActions({
        bookings,
        currentUser,
        setEditingBooking,
        setIsBookingModalOpen,
        onDataUpdate
    });

    return (
        <div style={{ overflowX: 'auto', border: '1px solid #ddd', borderRadius: '4px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #555', backgroundColor: '#f8f9fa' }}>
                        <th style={{ padding: '12px 15px', minWidth: '100px'}}>Кімната</th>
                        <th style={{ padding: '12px 15px' }}>Дата</th>
                        <th style={{ padding: '12px 15px', minWidth: '120px'}}>Час (від-до)</th>
                        <th style={{ padding: '12px 15px' }}>Опис</th>
                        <th style={{ padding: '12px 15px' }}>Учасники</th>
                        <th style={{ padding: '12px 15px' }}>Створено</th>
                        <th style={{ padding: '12px 15px' }}>Дії</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedBookings.map((booking, index) => {
                        const isParticipant = currentUser ? booking.participants.some(p => p.email === currentUser.email) : false;

                        return (
                            <tr key={booking.id} style={{ borderBottom: index === sortedBookings.length - 1 ? 'none' : '1px solid #eee' }}>
                                <td style={{ padding: '10px 15px', fontWeight: 'bold' }}>{roomsMap[booking.roomId] || `ID: ${booking.roomId}`}</td>
                                <td style={{ padding: '10px 15px' }}>{booking.date}</td>
                                <td style={{ padding: '10px 15px' }}>{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</td>
                                <td style={{ padding: '10px 15px' }}>{booking.description}</td>
                                <td style={{ padding: '10px 15px', fontSize: '0.9em', color: '#333' }}>
                                    {booking.participants.map(p => p.name).join(', ')}
                                </td>
                                <td style={{ padding: '10px 15px', color: '#888', fontSize: '0.8em' }}>
                                    {new Date(booking.createdAt).toLocaleDateString('uk-UA')}
                                </td>
                                <td style={{ padding: '5px 5px', minWidth: '300px' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                        
                                        {currentUser?.role === "Admin" && (
                                            <>
                                                {isParticipant ? (
                                                        <Button 
                                                            style={{ flex: 1, minWidth: '80px', padding: '5px', backgroundColor: '#a0a0a0ff' }} 
                                                            onClick={() => handleJoinBooking(booking.id, false)}
                                                        >
                                                            Вийти
                                                        </Button>
                                                    ) : (
                                                        <Button 
                                                            style={{ flex: 1, minWidth: '80px', padding: '5px', backgroundColor: '#00c79fff' }} 
                                                            onClick={() => handleJoinBooking(booking.id, true)}
                                                        >
                                                            Долучитись
                                                        </Button>
                                                    )}
                                                <Button style={
                                                    { flex: 1, 
                                                    minWidth: '80px', 
                                                    padding: '5px' }
                                                    } 
                                                    onClick={() => handleEditBooking(booking)}>Редагувати</Button>
                                                <Button style={
                                                    { flex: 1, 
                                                    minWidth: '80px', 
                                                    padding: '5px', 
                                                    backgroundColor: '#dc3545' }
                                                    } 
                                                    onClick={() => handleCancelBooking(booking.id)}>Видалити</Button>
                                            </>
                                        )}
                                        
                                        {currentUser?.role === "User" && (
                                            isParticipant ? (
                                                <Button 
                                                    style={{ width: '100%', backgroundColor: '#a0a0a0ff' }}
                                                    onClick={() => handleJoinBooking(booking.id, false)}
                                                >
                                                    Вийти зі зустрічі
                                                </Button>
                                            ) : (
                                                <Button 
                                                    style={{ width: '100%', backgroundColor: '#1AB394' }} 
                                                    onClick={() => handleJoinBooking(booking.id, true)}
                                                >
                                                    Долучитись
                                                </Button>
                                            )
                                        )}
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <BookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                initialData={editingBooking}
                onBookingSuccess={handleCloseModalAndUpdate}
                room={{ 
                    name: roomsMap[editingBooking?.roomId] || 'Завантаження...' 
                }}
            />
        </div>
    );
}

export default BookingsTable;