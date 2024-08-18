import React, { createContext, useState, useEffect } from 'react';

// Create context
const DataContext = createContext();

const DataProvider = ({ children }) => {
  // Function to parse game data from Local Storage
  const parseGameData = (data) => {
    if (!data) return { roomCode: "", gameSet: new Set(),  };
    
    const parsedData = JSON.parse(data);
    parsedData.gameSet = new Set(parsedData.gameSet); // Convert Array back to Set
    return parsedData;
  };

  // Initialize state with data from Local Storage or default values
  const [gameData, setGameData] = useState(() => {
    const savedGameData = localStorage.getItem('gameData');
    return parseGameData(savedGameData);
  });

  const [playerData, setPlayerData] = useState(() => {
    const savedPlayerData = localStorage.getItem('playerData');
    return savedPlayerData ? JSON.parse(savedPlayerData) : { playerName: "", playerId: "", arrangement: {}, turn: false };
  });

  // Update Local Storage whenever gameData or playerData changes
  useEffect(() => {
    // Convert Set to Array before saving to Local Storage
    const gameDataToSave = {
      ...gameData,
      gameSet: Array.from(gameData.gameSet) // Convert Set to Array for JSON serialization
    };
    localStorage.setItem('gameData', JSON.stringify(gameDataToSave));
  }, [gameData]);

  useEffect(() => {
    localStorage.setItem('playerData', JSON.stringify(playerData));
  }, [playerData]);

  return (
    <DataContext.Provider value={{ gameData, setGameData, playerData, setPlayerData }}>
      {children}
    </DataContext.Provider>
  );
};

export { DataContext, DataProvider };
