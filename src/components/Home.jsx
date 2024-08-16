import React from 'react';
import io from 'socket.io-client'
import qs from 'qs'
import Button from './Button';
import Input from './Input';
import './Home.css';
const ENDPOINT = 'ws://localhost:3000';


const Home = () => {

    const [state , setState] = React.useState("home");
    const [playerName, setPlayerName] = React.useState('');
    const [socket, setSocket] = React.useState(null);
    const [roomCode, setRoomCode] = React.useState('@#$%$^');
    const [gameStart, setGameStart] = React.useState(false);
    const [isMyTurn, setIsMyTurn] = React.useState(false);
    const [arrangement, setArrangement] = React.useState({});


    const handleJoinRoom = () => {
        setState("join");
    }
    
    const handleCreateRoom = () => {
        socket.emit('CreateRoom', {playerName});
        setState("create");
    }

    const handleInput = (e) => {
        if(e.target.value.length > 16) {
            return;
        }
        setRoomCode(e.target.value);
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(roomCode);
    }


    React.useEffect(()=>{
        const socket = io(ENDPOINT);
        setSocket(socket);
        
        socket.on('RoomCode', (roomCode) => {
            setRoomCode(roomCode);
        });

        socket.on('PlayerData', ({turn, arrangement}) => {
            setIsMyTurn(turn);
            setArrangement(arrangement);
        });

        socket.on('GameStart', () => {
            setGameStart(true);
        });

        return () => {
            socket.disconnect();
        }
    },[])




    return (
        <div className='main'>
            <div className='title-subheading'>
                <div className='title-div'>
                    <h1 className='title'>Bingo</h1>
                </  div>
                <div className='sub-title-div'>
                    <h2 className='sub-title'>Welcome to Bingo</h2>
                </div>
            </div>

           {state === "home" ? <div className='action-div'>
                <Button id="joinRoom" name="Join Room" onClick={handleJoinRoom} />
                <Button id="createRoom" name="Create Room" onClick={handleCreateRoom} />
            </div>  : null}

            {state === "join" ? <div className='action-div'>
                <Input type="text" className = "joinRoomInput" placeholder="Enter Room Code" value={roomCode} onChange={handleInput}  />
                <Button id="joinRoom"  name="Join Room" />
            </div> : null} 
            {state === "create" ? <div className='action-div'>
                <h2 className='createRoomCode'>{`${roomCode}`}</h2>
                <Button id="copy" name="Copy" onClick={handleCopy}/>
            </div> : null} 



        </div>
    );
}

export default Home;