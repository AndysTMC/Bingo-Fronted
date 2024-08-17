import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSocket } from "./Contexts/SocketProvider";
import "./Game.css";

const Game = () => {
  const socket = useSocket();
  const navigate = useNavigate();
  const location = useLocation();
  const [gameSet, setGameSet] = useState(null);
  const [turn, setTurn] = useState(false);
  const [gameEnd, setGameEnd] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [board, setBoard] = useState(null);

  const generateBoard = (arrangement) => {
    const board = Array(5)
      .fill()
      .map(() => Array(5).fill(0));

    for (const [key, value] of Object.entries(arrangement)) {
      const { x, y } = value;
      board[x][y] = parseInt(key); // Place the key at the specified position
    }

    return board;
  };

  const handleSocketEvents = () => {
    if (!socket) return;

    socket.on("PlayerData", ({ turn }) => {
      setTurn(turn);
    });

    socket.on("Update", ({ gameSet }) => {
      setGameSet(new Set(gameSet));
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
    if (!location.state) {
      navigate("/", { replace: true });
      return;
    }

    const { gameSet, isMyTurn, roomCode, arrangement } = location.state;
    setGameSet(new Set(gameSet));
    setTurn(isMyTurn);
    setRoomCode(roomCode);
    setBoard(generateBoard(arrangement));

    handleSocketEvents();

    // Cleanup socket listeners on component unmount
    return () => {
      if (socket) {
        socket.off("PlayerData");
        socket.off("Update");
        socket.off("Winner");
        socket.off("Draw");
        socket.off("OpponentLeft");
        socket.off("RoomsCount");
      }
    };
  }, [location.state, socket]);

  const handleCellClick = (row, col) => {
    if (turn && !gameSet.has(board[row][col])) {
      if (!socket.connected) {
        console.log("Socket not connected");
        return;
      }
      socket.emit("Mark", { roomCode, number: board[row][col] });
    }
  };

  if (!roomCode || !board || !gameSet) {
    return <></>;
  }

  return (
    <div className="bingo-game">
      <h1>Bingo</h1>
      <h2>Room Code: {roomCode}</h2>
      <div className="board">
        {board.map((row, i) => (
          <div key={i} className="row">
            {row.map((cell, j) => (
              <div
                key={`${i}-${j}`}
                className={`cell ${gameSet.has(cell) ? "marked" : ""}`}
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
