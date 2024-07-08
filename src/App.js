import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainComponent from './compo/MainComponent'
import Header from './compo/Header'


function App() {
  return (
    <>
    <BrowserRouter>
    <Header/>
    <Routes>
      <Route path='/' element={<MainComponent/>}></Route>
    </Routes>
    </BrowserRouter>
    
    </>
  )
}

export default App

