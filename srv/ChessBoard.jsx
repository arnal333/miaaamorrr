import React from 'react';
import { Chessboard } from 'react-chessboard';
import { useChessGame } from '../hooks/useChessGame';
import './ChessBoard.css';

const ChessBoard = ({ roomId }) => {
  const {
    game,
    fen,
    playerColor,
    isMyTurn,
    gameStarted,
    makeMove,
    resetGame
  } = useChessGame(roomId);

  if (!gameStarted) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Esperando jugadores...</p>
        <p className="room-id">Sala: {roomId}</p>
      </div>
    );
  }

  const onDrop = (sourceSquare, targetSquare) => {
    if (!isMyTurn) return false;

    const move = {
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q' // Siempre promover a reina por simplicidad
    };

    return makeMove(move);
  };

  const getBoardOrientation = () => {
    return playerColor || 'white';
  };

  const getCustomSquareStyles = () => {
    // Resaltar el último movimiento si existe
    const history = game.history({ verbose: true });
    const lastMove = history[history.length - 1];
    
    if (lastMove) {
      return {
        [lastMove.from]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' },
        [lastMove.to]: { backgroundColor: 'rgba(255, 255, 0, 0.4)' }
      };
    }
    return {};
  };

  return (
    <div className="chess-container">
      <div className="game-header">
        <div className="turn-indicator">
          {isMyTurn ? (
            <span className="my-turn">✨ Tu turno</span>
          ) : (
            <span className="opponent-turn">Esperando a tu oponente...</span>
          )}
        </div>
        <div className="game-info">
          <span className="room-info">Sala: {roomId}</span>
          <button onClick={resetGame} className="reset-button">
            Reiniciar
          </button>
        </div>
      </div>

      <div className="board-wrapper">
        <Chessboard
          id="chess-board"
          position={fen}
          onPieceDrop={onDrop}
          boardOrientation={getBoardOrientation()}
          customBoardStyle={{
            borderRadius: '4px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.5)'
          }}
          customDarkSquareStyle={{ backgroundColor: '#769656' }}
          customLightSquareStyle={{ backgroundColor: '#eeeed2' }}
          customSquareStyles={getCustomSquareStyles()}
          animationDuration={200}
          arePremovesAllowed={false}
          showBoardNotation={true}
        />
      </div>

      <div className="game-status">
        {game.isCheckmate() && (
          <div className="game-over">
            ¡Jaque mate! {game.turn() === 'w' ? 'Negras' : 'Blancas'} ganan
          </div>
        )}
        {game.isStalemate() && (
          <div className="game-over">¡Tablas por ahogado!</div>
        )}
        {game.isDraw() && (
          <div className="game-over">¡Tablas!</div>
        )}
        {game.inCheck() && !game.isCheckmate() && (
          <div className="check-warning">¡Jaque!</div>
        )}
      </div>
    </div>
  );
};

export default ChessBoard;