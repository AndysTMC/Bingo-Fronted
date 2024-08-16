import React from "react";
import qs from "qs";
import { useSocket } from "./Contexts/SocketProvider";
import Button from "./Button";
import Input from "./Input";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const ENDPOINT = "ws://10.1.187.235:3000";

const Home = () => {
    const socket = useSocket();
    const [state, setState] = React.useState("home");
    const [playerName, setPlayerName] = React.useState("");
    const [roomCode, setRoomCode] = React.useState("");
    const [gameStart, setGameStart] = React.useState(false);
    const [isMyTurn, setIsMyTurn] = React.useState(false);
    const [gameSet, setGameSet] = React.useState(new Set());
    const [arrangement, setArrangement] = React.useState({});
    const [copied, setCopied] = React.useState(false);
    const navigate = useNavigate();


    const handleHome = () => {
        if (state === "create") {
            socket.emit("Disconnect", { roomCode });
        }
        setState("home");
        setRoomCode("");
        setCopied(false);
    }


    const handleJoin = () => {
        socket.emit("JoinRoom", { roomCode, playerName });
    };
    const handleJoinRoom = () => {
        setState("join");
    };
    const handleCreateRoom = () => {
        socket.emit("CreateRoom", { playerName });
        setState("create");
    };

    const handleInput = (e) => {
        if (e.target.value.length > 16) {
            return;
        }
        setRoomCode(e.target.value);
    };

    const handleCopy = () => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard
                .writeText(roomCode)
                .then(() => setCopied(true))
                .catch((err) => console.error("Failed to copy: ", err));
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = roomCode;
            textArea.style.position = "fixed";
            textArea.style.opacity = "0";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                document.execCommand("copy");
                setCopied(true);
            } catch (err) {
                console.error("Failed to copy: ", err);
            }

            document.body.removeChild(textArea);
        }
    };

    React.useEffect(() => {
        if (!socket) {
            return;
        }
        socket.on("RoomCode", (roomCode) => {
            setRoomCode(roomCode);
        });

        socket.on("PlayerData", ({ turn, arrangement }) => {
            setIsMyTurn(turn);
            setArrangement(arrangement);
        });

        socket.on("GameStart", ({ gameSet }) => {
            setGameStart(true);
            setGameSet(new Set(gameSet));
        });

        socket.on("Error", (data) => {
            console.log(data);
        });

        return () => {
            socket.disconnect();
        };
    }, [socket]);

    React.useEffect(() => {
        if (gameStart) {
            navigate("/game", {
                state: {
                    playerName,
                    roomCode,
                    isMyTurn,
                    arrangement,
                    gameSet,
                },
                replace: true,
            });
        }
    }, [gameStart, navigate]);
    function disconnectBeforeUnload(socket, roomCode) {
        socket.emit("Disconnect", { roomCode });
    }
    
    React.useEffect(() => {
        if (!socket) {
            return;
        }
    
        const handleBeforeUnload = (ev) => {
            if (state === "create") {
                disconnectBeforeUnload(socket, roomCode);
            }
    
            ev.returnValue = ''; // This line is required for the prompt to work in some browsers
        };
    
        window.addEventListener("beforeunload", handleBeforeUnload);
    
        // Clean up the event listener on component unmount or when dependencies change
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [socket, roomCode, state]);

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
                        value={roomCode}
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
                    <h2 className="createRoomCode">{`${roomCode}`}</h2>
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
