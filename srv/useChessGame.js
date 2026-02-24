import { useState, useEffect, useCallback } from 'react';
import { Chess } from 'chess.js';
import { supabase } from '../services/supabase';

export const useChessGame = (roomId) => {
  const [game, setGame] = useState(new Chess());
  const [fen, setFen] = useState('start');
  const [playerColor, setPlayerColor] = useState(null);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Inicializar la sala
  useEffect(() => {
    if (!roomId) return;

    const initializeRoom = async () => {
      // Verificar si la sala existe
      const { data: existingRoom } = await supabase
        .from('chess_rooms')
        .select('*')
        .eq('id', roomId)
        .single();

      if (!existingRoom) {
        // Crear nueva sala (primer jugador)
        const { data: newRoom } = await supabase
          .from('chess_rooms')
          .insert([
            { 
              id: roomId, 
              fen: 'start',
              players: 1,
              created_at: new Date()
            }
          ])
          .select()
          .single();

        setPlayerColor('white');
        setIsMyTurn(true);
      } else {
        // Unirse a sala existente (segundo jugador)
        if (existingRoom.players === 1) {
          await supabase
            .from('chess_rooms')
            .update({ players: 2 })
            .eq('id', roomId);
          
          setPlayerColor('black');
          setIsMyTurn(false);
          setFen(existingRoom.fen);
          
          // Actualizar el juego local con el FEN existente
          const newGame = new Chess();
          newGame.load(existingRoom.fen);
          setGame(newGame);
        }
      }
      setGameStarted(true);
    };

    initializeRoom();

    // Suscribirse a cambios en la sala
    const subscription = supabase
      .channel(`room-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chess_rooms',
          filter: `id=eq.${roomId}`
        },
        (payload) => {
          const newFen = payload.new.fen;
          if (newFen !== fen) {
            setFen(newFen);
            const updatedGame = new Chess();
            updatedGame.load(newFen);
            setGame(updatedGame);
            
            // Actualizar turno
            const turn = updatedGame.turn();
            setIsMyTurn(
              (playerColor === 'white' && turn === 'w') ||
              (playerColor === 'black' && turn === 'b')
            );
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [roomId, fen, playerColor]);

  // Función para hacer un movimiento
  const makeMove = useCallback(async (move) => {
    if (!isMyTurn || !gameStarted) return false;

    try {
      // Intentar hacer el movimiento localmente
      const gameCopy = new Chess(game.fen());
      const result = gameCopy.move(move);

      if (result) {
        // Actualizar estado local
        setGame(gameCopy);
        const newFen = gameCopy.fen();
        setFen(newFen);

        // Actualizar en Supabase
        await supabase
          .from('chess_rooms')
          .update({ 
            fen: newFen,
            last_move_at: new Date()
          })
          .eq('id', roomId);

        return true;
      }
    } catch (error) {
      console.error('Error making move:', error);
    }
    return false;
  }, [game, isMyTurn, gameStarted, roomId]);

  // Función para reiniciar el juego
  const resetGame = useCallback(async () => {
    const newGame = new Chess();
    setGame(newGame);
    setFen('start');
    
    await supabase
      .from('chess_rooms')
      .update({ 
        fen: 'start',
        last_move_at: new Date()
      })
      .eq('id', roomId);
  }, [roomId]);

  return {
    game,
    fen,
    playerColor,
    isMyTurn,
    gameStarted,
    makeMove,
    resetGame
  };
};