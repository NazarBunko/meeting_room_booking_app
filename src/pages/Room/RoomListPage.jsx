import React from 'react';
import RoomCard from '../../components/Rooms/RoomCard.jsx';
import Button from '../../components/UI/Button.jsx';
import RoomModal from '../../components/Rooms/RoomModal.jsx';
import BookingModal from '../../components/Bookings/BookingModal.jsx';
import useRoomListActions from '../../hooks/useRoomListActions.js';
import { useNavigate } from 'react-router-dom';
import styles from './RoomListPage.module.css';

function RoomListPage() {
    const navigate = useNavigate();
    
    const {
        rooms,
        isLoading,
        isRoomModalOpen,
        isBookingModalOpen,
        editingRoom,
        selectedRoom,
        currentUser,
        setIsRoomModalOpen,
        setIsBookingModalOpen,
        handleAddRoom,
        handleEditRoom,
        handleSaveSuccess,
        handleDeleteRoom,
        handleOpenBookingModal,
        handleLogout,
        handleJoinRoom,
    } = useRoomListActions();

    if (isLoading) {
        return <p style={{ textAlign: 'center', marginTop: '50px' }}>Завантаження кімнат...</p>;
    }

    return (
        <div className={styles.container}>
            
            <div className={styles.header}>
                
                <div className={styles.userInfo}>
                    {currentUser && (
                        <div className={styles.userNameEmail}>
                            <p className={styles.userName}>{currentUser.name} ({currentUser.role})</p>
                            <p className={styles.userEmail}>{currentUser.email}</p>
                        </div>
                    )}
                </div>
                
                <h2 className={styles.pageTitle}>Переговорні Кімнати</h2>
                
                {currentUser?.role === "Admin"
                 ? <Button onClick={handleAddRoom} style={{ width: '150px' }}>+ Створити кімнату</Button>
                 : <div style={{ width: '150px' }}></div>}
            </div>
            
            {rooms.length === 0 ? (
                <p>Кімнат поки немає.</p>
            ) : (
                rooms.map(room => (
                    <RoomCard
                        key={room.id}
                        room={room}
                        onEdit={handleEditRoom}
                        onDelete={handleDeleteRoom}
                        onJoin={() => handleJoinRoom(room.id)}
                        onBook={handleOpenBookingModal}
                    />
                ))
            )}
            
            <div className={styles.footerActions}>
                
                <div className={styles.navButtons}>
                    <Button 
                        onClick={() => navigate('/users')} 
                        style={{ width: '150px', backgroundColor: '#007bff' }}
                    >
                        Користувачі
                    </Button>
                    <Button 
                        onClick={() => navigate('/bookings')} 
                        style={{ width: '150px', backgroundColor: '#1AB394' }}
                    >
                        Всі Бронювання
                    </Button>
                </div>

                <Button 
                    onClick={handleLogout} 
                    style={{ 
                        width: '200px', 
                        backgroundColor: '#dc3545',
                    }}
                >
                    Вийти (Logout)
                </Button>
            </div>


            <RoomModal
                isOpen={isRoomModalOpen}
                onClose={() => setIsRoomModalOpen(false)}
                initialData={editingRoom}
                onSaveSuccess={handleSaveSuccess}
            />

            {selectedRoom && (
                <BookingModal
                    isOpen={isBookingModalOpen}
                    onClose={() => setIsBookingModalOpen(false)}
                    room={selectedRoom}
                    onBookingSuccess={handleSaveSuccess}
                    mode={"Create"}
                />
            )}
        </div>
    );
}

export default RoomListPage;