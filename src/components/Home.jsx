
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
    const { gameData, setGameData, playerData, setPlayerData, resetData } = useContext(DataContext);
    const [state, setState] = React.useState("home");
    const [gameStart, setGameStart] = React.useState(false);
    const [copied, setCopied] = React.useState(false);
    const navigate = useNavigate();
        
    document.addEventListener('keyup', function(event) {
        // Prevent the default action for the keyup event if Ctrl is pressed
        if (event.ctrlKey) {
            event.preventDefault();
        }
    });
    
    window.addEventListener('keydown', function(event) {
        if (event.ctrlKey && (event.key === '+' || event.key === '-' || event.key === '0')) {
            event.preventDefault();
        }
    });
    
    window.addEventListener('wheel', function(event) {
        if (event.ctrlKey) {
            event.preventDefault();
        }
    }, { passive: false });
    

    document.addEventListener('selectstart', function(event) {
        event.preventDefault();
        return false;
    });
    


    const handleHome = () => {
        if (state === "create") {
            socket.emit("Disconnect", { roomCode: gameData.roomCode });
        }
        setState("home");
        setGameData((prev) => ({
            ...prev,
            roomCode: "",
            gameSet: new Set()
        }));
        setPlayerData((prev) => ({
            ...prev, 
            playerId: "" ,
            arrangement: {},
            turn: false,
        }));
        setCopied(false);
    }
    const handleJoin = () => {
        socket.emit("JoinRoom", { roomCode: gameData.roomCode, playerName: gameData.playerName });
    };
    const handleJoinRoom = () => {
        setState("join");
    };
    const handleCreateRoom = () => {
        socket.emit("CreateRoom", { playerName: playerData.playerName});
        setState("create");
    };

    const handleInput = (e) => {
        if (e.target.value.length > 6) {
            return;
        }
        setGameData((prev) => ({ ...prev, roomCode: (e.target.value).toLowerCase() }));
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
        resetData();
    },[])

    React.useEffect(() => {
        if(!socket) { return; }
        if (!socket.connected) {
            socket.connect(); 
            socket.emit("RegisterNewSocketId", { roomCode: gameData.roomCode, playerId: playerData.playerId });
        }
        socket.on("RoomCode", (roomCode) => {
            console.log("RoomCode Received")
            setGameData((prev) => ({ ...prev, roomCode }));
        });

        socket.on("PlayerData", ({ playerId, arrangement, turn}) => {
            setPlayerData((prev) => ({ ...prev, playerId, arrangement, turn }));
        })

        socket.on("GameStart", ({ gameSet }) => {
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

    React.useEffect(() => {
        if (state === "home") {
            setGameData((prev) => ({ ...prev, roomCode: "" }));
        }
    }, [state])

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
