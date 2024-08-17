import React, { createContext, useState } from 'react';

const DataContext = createContext();

const DataProvider = ({ children }) => {
  const [gameData, setGameData] = useState({
    roomCode: "",
    gameSet: new Set(),
    arrangement: {},
    turn: false,
  });

  const [playerData, setPlayerData] = useState({
    playerName: "",
    playerId: "",
  });

  return (
    <DataContext.Provider value={{ gameData, setGameData, playerData, setPlayerData }}>
      {children}
    </DataContext.Provider>
  );
};

export { DataContext, DataProvider };