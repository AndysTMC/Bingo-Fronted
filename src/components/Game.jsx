import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "./Contexts/SocketContext";
import { DataContext } from "./Contexts/DataContext";
import Button from "./Button";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Game.css";

const Game = () => {
  const socket = useSocket();
  const navigate = useNavigate();
  const { playerData, setPlayerData, gameData, setGameData } = useContext(DataContext);

  const [gameEnd, setGameEnd] = useState(false);
  const [board, setBoard] = useState(null);

  const generateBoard = (arrangement) => {
    const board = Array(5).fill().map(() => Array(5).fill(0));
    for (const [val, pos] of Object.entries(arrangement)) {
      board[pos['x']][pos['y']] = parseInt(val);
    }
    return board;
  };


  document.addEventListener('wheel', function (event) {
    if (event.ctrlKey) {
      event.preventDefault();
    }
  }, { passive: false });

  document.addEventListener('keydown', function (event) {
    if (event.ctrlKey && (event.key === '+' || event.key === '-' || event.key === '0')) {
      event.preventDefault();
    }
  });



  const handleSocketEvents = () => {
    socket.on("PlayerData", ({ turn }) => {
      setPlayerData((prev) => ({ ...prev, turn }));
    });

    socket.on("Update", ({ gameSet }) => {
      setGameData((prev) => ({ ...prev, gameSet: new Set(gameSet) }));
    });

    socket.on("Winner", ({ winnerName, winnerId, ended }) => {
      setGameEnd(true);
      winnerId === playerData.playerId ? alert("You have won!") : alert("You have lost!");
      navigate("/", { replace: true });
    });

    socket.on("Draw", () => {
      setGameEnd(true);
      alert("It's a draw!");
      navigate("/", { replace: true });
    });

    socket.on("OpponentLeft", () => {
      setGameEnd(true);
      alert("Opponent left the game!");
    });

    socket.on("RoomsCount", (count) => {
      console.log(count);
    });
    socket.on("Disconnect", () => {
      setGameEnd(true);
      alert("Opponent left the game!");
      navigate("/", { replace: true });
    });
  };

  useEffect(() => {
    if (!socket) return;
    if (socket.connected === false) {
      socket.connect();
      socket.emit("RegisterNewSocketId", { roomCode: gameData.roomCode, playerId: playerData.playerId });
    }
    handleSocketEvents();
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
  }, [socket]);

  useEffect(() => {
    if (!playerData.arrangement) return;
    setBoard(generateBoard(playerData.arrangement));
  }, [playerData.arrangement]);

  const handleCellClick = (row, col) => {
    if (playerData.turn && !gameData.gameSet.has(board[row][col])) {
      socket.emit("Mark", { roomCode: gameData.roomCode, number: board[row][col] });
    }
  };
  useEffect(() => {
    console.log(gameData, board)
    if (!gameData.roomCode) {
      navigate("/", { replace: true });
    }
  }, [gameData.roomCode, navigate]);

  return (
    <div className="bingo-game no-scrollbar">
      <div className="divhomebutton exit-game">
          <Button name={<FontAwesomeIcon icon={faHouse} />} className="btn homebutton" onClick={() => navigate("/", {replace: true})} />
      </div>
      <h1>Bingo</h1>
      <h2>Room Code: {gameData.roomCode}</h2>
      <div className="board">
        {board && board.map((row, i) => (
          <div key={i} className="row">
            {row.map((cell, j) => (
              <div
                key={`${i}-${j}`}
                className={`cell ${gameData.gameSet.has(cell) ? "marked" : ""}`}
                onClick={() => handleCellClick(i, j)}>
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="game-status">
        <h3 className="GameStatus">Game Status</h3>
        <div className={playerData.turn ? "status turn" : "status"}>
          {gameEnd ? "Game Over" : playerData.turn ? "Your Turn" : "Opponent's Turn"}
        </div>
      </div>
    </div>
  );
};

export default Game;
