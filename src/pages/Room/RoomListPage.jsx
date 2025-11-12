import React, { useState, useEffect } from 'react';
import RoomCard from '../../components/Rooms/RoomCard.jsx';
import Button from '../../components/UI/Button.jsx';
import RoomModal from '../../components/Rooms/RoomModal.jsx';
import BookingModal from '../../components/Bookings/BookingModal.jsx';
import { fetchRooms, deleteRoom } from '../../services/roomsService.js';
import { logoutUser, getCurrentUser } from '../../services/authService.js';
import { useNavigate } from 'react-router-dom';
import styles from './RoomListPage.module.css';

function RoomListPage() {
    const [rooms, setRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    
    const [editingRoom, setEditingRoom] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null); 
    
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    const loadData = () => {
        setIsLoading(true);
        const user = getCurrentUser();
        setCurrentUser(user);
        
        const loadedRooms = fetchRooms();
        setRooms(loadedRooms);
        setIsLoading(false);
    };

    useEffect(() => {
        const timerId = setTimeout(() => {
            loadData();
        }, 500);

        return () => clearTimeout(timerId);
    }, []);

    const handleAddRoom = () => {
        setEditingRoom(null);
        setIsRoomModalOpen(true);
    };

    const handleEditRoom = (roomData) => {
        setEditingRoom(roomData);
        setIsRoomModalOpen(true);
    };
    
    const handleSaveSuccess = () => {
        setIsRoomModalOpen(false);
        setIsBookingModalOpen(false);
        loadData();
    };
    
    const handleDeleteRoom = (id) => {
        if (window.confirm("Ви впевнені, що хочете видалити цю кімнату?")) {
            const result = deleteRoom(id);
            if (result.success) {
                alert("Кімнату видалено!");
                loadData();
            } else {
                alert(result.message);
            }
        }
    };

    const handleOpenBookingModal = (room) => {
        setSelectedRoom(room);
        setIsBookingModalOpen(true);
    };
    
    const handleLogout = () => {
        logoutUser();
        navigate('/login', { replace: true });
    };

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
                        onJoin={(id) => navigate(`/rooms/${id}`)}
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