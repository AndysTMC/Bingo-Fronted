// This is a component which is the game page of Bingo Game of 25 x 25 grid.

import React from "react"
import io from 'socket.io-client'
import qs from 'qs'

const Game = () => {
    const { gameSet, setGameSet } = React.useState(new Set())
    const { turn, setTurn } = React.useState(false)
    const { gameEnd, setGameEnd } = React.useState(false)
    const { roomCode, setRoomCode } = React.useState(qs.parse(window.location.search, { ignoreQueryPrefix: true }).roomCode)
    const { board, setBoard } = React.useState(Array(25).fill(Array(25).fill(0)))
    for (let i = 0; i < 25; i++) {
        for (let j = 0; j < 25; j++) {
            board[i][j] = i * 5 + j + 1;
        }
    }
    return (
        <div>
            <div>
                <h1>Bingo</h1>
                <h2>Room Code: {roomCode}</h2>
            </div>
            <div>
                <div>
                    {board.map((row, i) => {
                        return (
                            <div>
                                {row.map((cell, j) => {
                                    return (
                                        <div>
                                            {cell}
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>
                <div>
                    <h3>Game Status</h3>
                    <div>
                        {gameEnd ? "Game Over" : turn ? "Your Turn" : "Opponent's Turn"}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Game