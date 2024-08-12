import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import { React} from "react";
import Home from './components/Home'
import Game from './components/Game'


function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/game' element={<Game />} />
            </Routes>
        </Router>
    )
}

export default App
