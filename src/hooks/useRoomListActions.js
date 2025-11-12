import { useState, useEffect, useCallback } from 'react';
import { fetchRooms, deleteRoom } from '../services/roomsService.js';
import { logoutUser, getCurrentUser } from '../services/authService.js';
import { useNavigate } from 'react-router-dom';

function useRoomListActions() {
    const [rooms, setRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    
    const [editingRoom, setEditingRoom] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null); 
    
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();

    const loadData = useCallback(() => {
        setIsLoading(true);
        const user = getCurrentUser();
        setCurrentUser(user);
        
        const loadedRooms = fetchRooms();
        setRooms(loadedRooms);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        const timerId = setTimeout(() => {
            loadData();
        }, 500);

        return () => clearTimeout(timerId);
    }, [loadData]);

    const handleAddRoom = useCallback(() => {
        setEditingRoom(null);
        setIsRoomModalOpen(true);
    }, []);

    const handleEditRoom = useCallback((roomData) => {
        setEditingRoom(roomData);
        setIsRoomModalOpen(true);
    }, []);
    
    const handleSaveSuccess = useCallback(() => {
        setIsRoomModalOpen(false);
        setIsBookingModalOpen(false);
        loadData();
    }, [loadData]);
    
    const handleDeleteRoom = useCallback((id) => {
        if (window.confirm("Ви впевнені, що хочете видалити цю кімнату?")) {
            const result = deleteRoom(id);
            if (result.success) {
                alert("Кімнату видалено!");
                loadData();
            } else {
                alert(result.message);
            }
        }
    }, [loadData]);

    const handleOpenBookingModal = useCallback((room) => {
        setSelectedRoom(room);
        setIsBookingModalOpen(true);
    }, []);
    
    const handleLogout = useCallback(() => {
        logoutUser();
        navigate('/login', { replace: true });
    }, [navigate]);

    const handleJoinRoom = useCallback((id) => {
        navigate(`/rooms/${id}`);
    }, [navigate]);

    return {
        rooms,
        isLoading,
        isRoomModalOpen,
        isBookingModalOpen,
        editingRoom,
        selectedRoom,
        currentUser,
        setIsRoomModalOpen,
        setIsBookingModalOpen,
        loadData, 
        handleAddRoom,
        handleEditRoom,
        handleSaveSuccess,
        handleDeleteRoom,
        handleOpenBookingModal,
        handleLogout,
        handleJoinRoom,
    };
}

export default useRoomListActions;