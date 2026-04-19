import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import CreateChampion from './pages/CreateChampion'
import Gallery from './pages/Gallery'
import ChampionDetail from './pages/ChampionDetail'
import EditChampion from './pages/EditChampion'

export default function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateChampion />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/champion/:id" element={<ChampionDetail />} />
        <Route path="/edit/:id" element={<EditChampion />} />
      </Routes>
    </div>
  )
}
