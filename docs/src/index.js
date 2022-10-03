import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import NavBar from './components/NavBar'
import BestPractices from './pages/BestPractices'
import Home from './pages/Home'
import HowItWorks from './pages/HowItWorks'
import LegalIssues from './pages/LegalIssues'
import WhoAreWe from './pages/WhoAreWe'
import './styles/index.scss'

export default function App () {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route index element={<Home />} />
        <Route path='how-it-works' element={<HowItWorks />} />
        <Route path='who-are-we' element={<WhoAreWe />} />
        <Route path='best-practices' element={<BestPractices />} />
        <Route path='legal-issues' element={<LegalIssues />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<App />)
