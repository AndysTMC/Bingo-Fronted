import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { DataProvider } from "./components/Contexts/DataContext";
import Home from './components/Home'
import Game from './components/Game'
import './App.css'


function App() {
    return (
        <DataProvider>
            <Router>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/game' element={<Game />} />
                </Routes>
            </Router>
        </DataProvider>
    )
}

export default App
