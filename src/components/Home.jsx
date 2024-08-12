import React from 'react';
import io from 'socket.io-client'
import qs from 'qs'
import Button from './Button';
import Input from './Input';
import './Home.css';



const Home = () => {

    const [state , setState] = React.useState("home");
    const [roomCode, setRoomCode] = React.useState('@#$%$^');

    const handleJoinRoom = () => {
        setState("join");
    }
    
    const handleCreateRoom = () => {
        setState("create");
    }

    const handleInput = (e) => {
        setRoomCode(e.target.value);
    }


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
                <Input type="text" placeholder="Enter Room Code" value={roomCode} onChange={handleInput}  />
                <Button id="joinRoom" name="Join Room" />
            </div> : null} 
            {state === "create" ? <div className='action-div'>
                <h2>{`${roomCode}`}</h2>
                <Button id="copy" name="Copy" />
            </div> : null} 



        </div>
    );
}

export default Home;