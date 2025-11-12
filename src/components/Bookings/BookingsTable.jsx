import React, { useState } from 'react';
import Button from '../UI/Button';
import BookingModal from './BookingModal';

function BookingTable({ bookings, roomsMap }) {
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [editingBooking, setEditingBooking] = useState(null);

    const formatTime = (time) => time ? time.substring(0, 5) : 'N/A';

    const handleEditBooking = (booking) => {
        setEditingBooking(booking);
        setIsBookingModalOpen(true);
    };

    const handleSaveSuccess = () => {
        setIsBookingModalOpen(false);
        window.location.reload();
    };
    
    const sortedBookings = [...bookings].sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.startTime}`);
        const dateB = new Date(`${b.date}T${b.startTime}`);
        return dateB - dateA; 
    });

    return (
        <div style={{ overflowX: 'auto', border: '1px solid #ddd', borderRadius: '4px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #555', backgroundColor: '#f8f9fa' }}>
                        <th style={{ padding: '12px 15px' }}>Кімната</th>
                        <th style={{ padding: '12px 15px' }}>Дата</th>
                        <th style={{ padding: '12px 15px' }}>Час (від-до)</th>
                        <th style={{ padding: '12px 15px' }}>Опис</th>
                        <th style={{ padding: '12px 15px' }}>Учасники</th>
                        <th style={{ padding: '12px 15px' }}>Створено</th>
                        <th style={{ padding: '12px 15px' }}>Дії</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedBookings.map((booking, index) => (
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
                            <td style={{ padding: '10px 15px' }}>
                                <Button onClick={() => handleEditBooking(booking)}>Редагувати</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <BookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                initialData={editingBooking}
                onBookingSuccess={handleSaveSuccess}
                mode={"Edit"}
            />
        </div>
    );
}

export default BookingTable;