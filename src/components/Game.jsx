import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "./Contexts/SocketContext";
import { DataContext } from "./Contexts/DataContext";
import "./Game.css";

const Game = () => {
  const socket = useSocket();
  const navigate = useNavigate();
  const { playerData, gameData, setGameData } = useContext(DataContext);

  const [gameEnd, setGameEnd] = useState(false);
  const [board, setBoard] = useState(null);
  
  const generateBoard = (arrangement) => {
    const board = Array(5).fill().map(() => Array(5).fill(0));
    for (const [val, pos] of Object.entries(arrangement)) { board[pos['x']][pos['y']] = parseInt(key); }
    return board;
  };

  const handleSocketEvents = () => {
    if (!socket) return;
    
    socket.on("PlayerData", ({ turn }) => {
      setGameData((prev) => ({ ...prev, turn }));
    });

    socket.on("Update", ({ gameSet }) => {
      setGameData((prev) => ({ ...prev, gameSet: new Set(gameSet) }));
    });

    socket.on("Winner", ({ winner }) => {
      setGameEnd(true);
      alert(`${winner} wins!`);
    });

    socket.on("Draw", () => {
      setGameEnd(true);
      alert("It's a draw!");
    });

    socket.on("OpponentLeft", () => {
      setGameEnd(true);
      alert("Opponent left the game!");
    });

    socket.on("RoomsCount", (count) => {
      console.log(count);
    });
  };

  useEffect(() => {
    if (!socket) return;
    if (socket.connected == false) { socket.connect(); }
    handleSocketEvents();
    return () => {
      if (socket) {
        socket.off("PlayerData"); socket.off("Update"); socket.off("Winner"); 
        socket.off("Draw"); socket.off("OpponentLeft");socket.off("RoomsCount");
      }
    };
  }, [ socket]);

  const handleCellClick = (row, col) => {
    if (gameData.turn && !gameData.gameSet.has(board[row][col])) {
      socket.emit("Mark", { roomCode: gameData.roomCode, number: board[row][col] });
    }
  };

  if (!gameData.roomCode || !board || !gameData.gameSet) {
    return <></>;
  }

  return (
    <div className="bingo-game">
      <h1>Bingo</h1>
      <h2>Room Code: {gameData.roomCode}</h2>
      <div className="board">
        {board.map((row, i) => (
          <div key={i} className="row">
            {row.map((cell, j) => (
              <div
                key={`${i}-${j}`}
                className={`cell ${gameData.gameSet.has(cell) ? "marked" : ""}`}
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
        <div className={gameData.turn ? "status turn" : "status"}>
          {gameEnd ? "Game Over" : turn ? "Your Turn" : "Opponent's Turn"}
        </div>
      </div>
    </div>
  );
};

export default Game;
