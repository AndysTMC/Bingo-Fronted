import React, { useContext } from "react";
import { useSocket } from "./Contexts/SocketContext";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import Input from "./Input";
import "./Home.css";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DataContext } from "./Contexts/DataContext";

const Home = () => {
    const socket = useSocket();
    const { gameData, setGameData, playerData, setPlayerData } = useContext(DataContext);
    const [state, setState] = React.useState("home");
    const [gameStart, setGameStart] = React.useState(false);
    const [copied, setCopied] = React.useState(false);
    const navigate = useNavigate();
    const handleHome = () => {
        if (state === "create") {
            socket.emit("Disconnect", { roomCode: gameData.roomCode });
        }
        setState("home");
        setGameData((prev) => ({
            ...prev,
            roomCode: "",
            gameSet: new Set(),
            arrangement: {},
            turn: false,
        }));
        setPlayerData((prev) => ({ ...prev, playerId: "" }));
        setCopied(false);
    }
    const handleJoin = () => {
        socket.emit("JoinRoom", { roomCode: gameData.roomCode, playerName: gameData.playerName });
    };
    const handleJoinRoom = () => {
        setState("join");
    };
    const handleCreateRoom = () => {
        socket.emit("CreateRoom", { playerName: playerData.playerName });
        setState("create");
    };

    const handleInput = (e) => {
        if (e.target.value.length > 16) {
            return;
        }
        setGameData((prev) => ({ ...prev, roomCode: e.target.value }));
    };

    const handleCopy = () => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(gameData.roomCode) .then(() => setCopied(true)).catch((err) => console.error("Failed to copy: ", err));
        } else {
            const tA = document.createElement("textarea"); tA.value = gameData.roomCode; 
            tA.style.position = "fixed"; tA.style.opacity = "0";
            document.body.appendChild(tA); tA.focus(); tA.select();
            try { document.execCommand("copy"); setCopied(true);
            } catch (err) { console.error("Failed to copy: ", err); }
            document.body.removeChild(tA);
        }
    };

    React.useEffect(() => {
        if (!socket) {
            return;
        }
        socket.on("RoomCode", (roomCode) => {
            setGameData((prev) => ({ ...prev, roomCode }));
        });

        socket.on("PlayerData", ({ turn, arrangement, playerId }) => {
            setGameData((prev) => ({ ...prev, turn, arrangement }));
            setPlayerData((prev) => ({ ...prev, playerId }));
        });

        socket.on("GameStart", ({ gameSet }) => {
            setGameData((prev) => ({ ...prev, gameSet: new Set(gameSet) }));
            setGameStart(true);
        });

        socket.on("Error", (data) => {
            console.log(data);
        });

        return () => {
            socket.disconnect();
        };
    }, [socket]);

    React.useEffect(() => {
        if (gameStart) { navigate("/game", { replace: true,}); }
    }, [gameStart, navigate]);
    
    function disconnectBeforeUnload(socket, roomCode) { socket.emit("Disconnect", { roomCode }); }
    
    React.useEffect(() => {
        if (!socket) { return; }
        const handleBeforeUnload = (ev) => {
            if (state === "create") { disconnectBeforeUnload(socket, gameData.roomCode); }
            ev.returnValue = '';
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => { window.removeEventListener("beforeunload", handleBeforeUnload); };
    }, [socket, gameData.roomCode, state]);

    return (
        <div className="main">
            <div className="title-subheading">
                <div className="title-div">
                    <h1 className="title">Bingo</h1>
                </div>
                <div className="sub-title-div">
                    <h2 className="sub-title">Welcome to Bingo</h2>
                </div>
            </div>

            {state === "home" ? (
                <div className="action-div">
                    <Button id="joinRoomHome" name="Join Room" onClick={handleJoinRoom} />
                    <Button
                        id="createRoom"
                        name="Create Room"
                        onClick={handleCreateRoom}
                    />
                </div>
            ) : null}

            {state === "join" ? (
                <div className="action-div">
                    <Input
                        type="text"
                        className="joinRoomInput"
                        placeholder="Enter Room Code"
                        value={gameData.roomCode}
                        onChange={handleInput}
                    />
                    <div className="divhomebutton">
                        <Button id="joinRoom" name="Join" onClick={handleJoin} />
                        <Button id="homeButton" name={<FontAwesomeIcon icon={faHouse} />} className="btn homebutton" onClick={handleHome}/>
                    </div>
                </div>
            ) : null}
            {state === "create" ? (
                <div className="action-div">
                    <h2 className="createRoomCode">{`${gameData.roomCode}`}</h2>
                    <div className="divhomebutton">
                        <Button
                            id="copy"
                            name={copied ? "Copied" : "Copy"}
                            onClick={handleCopy}
                        />
                        <Button id="homeButton" name={<FontAwesomeIcon icon={faHouse} />} className="btn homebutton" onClick={handleHome} />
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default Home;
