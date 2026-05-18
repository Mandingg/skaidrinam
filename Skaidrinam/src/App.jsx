import './App.css'
import { Routes, Route } from "react-router";
import Navigation from './components/Navigation'
import MainPage from './components/MainPage'
import Analytics from './components/Analytics'
import Warranties from './components/Warranties'
import Profile from './components/Profile'
import NotFound from './components/NotFound'

function App() {
  return (
    <>
      <Navigation/>
      <Routes>
        <Route path="/pagrindinis" element = {<MainPage/>} />
        <Route path="/analitika" element={<Analytics/>} />
        <Route path="/garantijos" element={<Warranties/>} />
        <Route path="/profilis" element={<Profile/>} />
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </>
  )
}

export default App
