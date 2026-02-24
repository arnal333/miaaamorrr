import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './RoomCreator.css';

const RoomCreator = () => {
  const [roomIdInput, setRoomIdInput] = useState('');

  const createNewRoom = () => {
    const newRoomId = uuidv4().substring(0, 8);
    window.location.href = `/room/${newRoomId}`;
  };

  const joinRoom = (e) => {
    e.preventDefault();
    if (roomIdInput.trim()) {
      window.location.href = `/room/${roomIdInput.trim()}`;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#262421',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px'
    }}>
      <h1 style={{ textAlign: 'center', fontSize: '28px', margin: '40px 0' }}>
        ♟️ Chess PWA
      </h1>
      
      <div style={{ maxWidth: '400px', margin: '0 auto', width: '100%' }}>
        <button 
          onClick={createNewRoom}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: '#81b64c',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '18px',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          Crear nueva sala
        </button>

        <div style={{ textAlign: 'center', margin: '20px 0', color: '#b6bfc4' }}>
          o
        </div>

        <form onSubmit={joinRoom} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="text"
            placeholder="Introduce código de sala"
            value={roomIdInput}
            onChange={(e) => setRoomIdInput(e.target.value)}
            style={{
              padding: '14px',
              backgroundColor: '#3a3a3a',
              border: '1px solid #4a4a4a',
              borderRadius: '8px',
              color: 'white',
              fontSize: '16px'
            }}
          />
          <button 
            type="submit"
            style={{
              padding: '14px',
              backgroundColor: '#4a4a4a',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Unirse a sala
          </button>
        </form>
      </div>
    </div>
  );
};

export default RoomCreator;