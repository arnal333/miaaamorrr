import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RoomCreator from './components/RoomCreator';
import ChessBoard from './components/ChessBoard';
import './styles/App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoomCreator />} />
        <Route path="/room/:roomId" element={<ChessBoardWrapper />} />
      </Routes>
    </BrowserRouter>
  );
}

function ChessBoardWrapper() {
  const roomId = window.location.pathname.split('/')[2];
  return <ChessBoard roomId={roomId} />;
}

export default App;