import './App.css'
import React,{useState} from 'react'
import PAGES from'./controllers/pages'
import LOGIN from './pages/login'
import SIGNUP from './pages/signup'
import { AppContext } from './AppContext'
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom'


function App() {
  const [state, setstate] = useState(10)

  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<PAGES/>} />
        <Route path="/login" element={<LOGIN/>} />
        <Route path="/signup" element={<SIGNUP/>} />


        </Routes>
    </Router>
      
    </>
  )
}

export default App
