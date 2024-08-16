import React, { useState, useEffect } from "react";
import io from 'socket.io-client';
import qs from 'qs';

import './Game.css'; 

const Game = () => {
  const socket = io(); 

  const [gameSet, setGameSet] = useState(new Set());
  const [turn, setTurn] = useState(false);
  const [gameEnd, setGameEnd] = useState(false);
  const [roomCode, setRoomCode] = useState(""); //qs.parse(window.location.search, { ignoreQueryPrefix: true }).roomCode    

  const generateRandomBoard = () => {
    const numbers = Array(25).fill(null).map((_, index) => index + 1);
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    return Array(5).fill(null).map((_, row) => numbers.slice(row * 5, (row + 1) * 5));
  };

  const [board, setBoard] = useState(generateRandomBoard());

  useEffect(() => {
    socket.on('updateBoard', (data) => {
      setBoard((prevBoard) => {
        const updatedBoard = [...prevBoard];
        updatedBoard[data.row][data.col] = data.value;
        return updatedBoard;
      });
    });
  }, [socket]);

  const handleCellClick = (row, col) => {
    if (turn && !gameSet.has(board[row][col])) {
      setGameSet((prevSet) => new Set([...prevSet, board[row][col]]));
      socket.emit('cellClicked', { row, col, roomCode });
      if (0) {/* bingo condition */
        setGameEnd(true);
        socket.emit('bingo', roomCode);
      }
    }
  };

  return (
    <div className="bingo-game"> {/* Added class for styling */}
      <h1>Bingo</h1>
      <h2>Room Code: {roomCode}</h2>
      <div className="board">
        {board.map((row, i) => (
          <div key={i} className="row">
            {row.map((cell, j) => (
              <div
                key={`${i}-${j}`}
                className={`cell ${gameSet.has(cell) ? 'marked' : ''}`} // Add styling for marked cells
                onClick={() => handleCellClick(i, j)}
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="game-status">
        <h3>Game Status</h3>
        <div className={turn ? "status turn" : "status"}>
          {gameEnd ? "Game Over" : turn ? "Your Turn" : "Opponent's Turn"}
        </div>
      </div>
    </div>
  );
};

export default Game;